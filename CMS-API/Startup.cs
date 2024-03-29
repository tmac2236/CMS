using System.Text;
using API.Data.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;

using AutoMapper;
using API.Data.Interface;
using API.Filters;
using API.Helpers;
using API.Data.Interface.CMS;
using API.Data.Repository.CMS;
using API.Data.Interface.DKS;
using API.Models.CMS;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //security
            services.AddCors();
            services.AddDbContext<DKSContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DKSConnection")));
            services.AddDbContext<CMSContext>(options => options.UseSqlServer(Configuration.GetConnectionString("CMSConnection")));

            services.AddControllers();
            /*
            services.AddControllersWithViews()
                .AddNewtonsoftJson(options =>
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            );
            */
            services.AddMvc(option => option.EnableEndpointRouting = false)
            .AddSessionStateTempDataProvider()
              .AddNewtonsoftJson(opt =>
              {
                  opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
              });

            services.AddAutoMapper(typeof(Startup));
            //DAO
            services.AddScoped<IDKSDAO, DKSDAO>();
            services.AddScoped<IWarehouseDAO, WarehouseDAO>();
            services.AddScoped<ISamPartBDAO, SamPartBDAO>();
            services.AddScoped<ICMSCarDAO, CMSCarDAO>();
            services.AddScoped<ICMSCarManageRecordDAO, CMSCarManageRecordDAO>();
            services.AddScoped<ICMSCompanyDAO, CMSCompanyDAO>();
            services.AddScoped<ICMSDepartmentDAO, CMSDepartmentDAO>();
            services.AddScoped<IUserDAO, UserDAO>();

            //Service

            /*
            //新增Quartz服務
            services.AddSingleton<IJobFactory, SingletonJobFactory>();
            services.AddSingleton<ISchedulerFactory, StdSchedulerFactory>();
            //新增我們的Job
            services.AddSingleton<ShowDataTimeJob>();
            services.AddSingleton(
                 new JobSchedule(jobType: typeof(ShowDataTimeJob), cronExpression: "0/5 * * * * ?")//每五秒鐘觸發一次
           );
           //啟動QuartzHostedServie
            services.AddHostedService<QuartzHostedService>();
            */
            //auth
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII
                        .GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });
            //AOP
            services.AddScoped<ApiExceptionFilter>();
            services.AddScoped<ApiActionFilter>();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                //疑似不會跑到此行，因為已有了ApiExceptionFilter
                app.UseExceptionHandler(
                    builder =>
                    {
                        builder.Run(async context =>
                        {
                            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                            var error = context.Features.Get<IExceptionHandlerFeature>();
                            if (error != null)
                            {
                                context.Response.AddApplicationError(error.Error.Message);
                                await context.Response.WriteAsync(error.Error.Message);
                            }

                        });
                    }
                );
            }

            //security
            app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            app.UseHttpsRedirection();
            //auth
            app.UseAuthentication();
            app.UseRouting();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });


        }
    }
}
