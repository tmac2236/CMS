using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using API.DTOs;
using Microsoft.AspNetCore.Hosting;
using API.Data.Interface.CMS;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    public class AuthController : ApiController
    {
        private readonly IUserDAO _userDAO;
        public AuthController(IConfiguration config, IWebHostEnvironment webHostEnvironment, ILogger<AuthController> logger, IUserDAO userDAO)
                 : base(config, webHostEnvironment,logger)
        {
            _userDAO = userDAO;
        }
        [HttpPost("login")]
        public IActionResult Login(UserDto userForLoginDto)
        {
            _logger.LogInformation(String.Format(@"******  AuthController Login fired!! ******"));
            var theModel = _userDAO
                    .FindSingle(x => x.Account == userForLoginDto.Account && x.Password == userForLoginDto.Password);

            if (theModel == null)
            {
                return Unauthorized();
            }
            var version = _config.GetSection("AppSettings:Version").Value;
            var updateTime = _config.GetSection("AppSettings:UpdateTime").Value;

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, theModel.Account),
                new Claim(ClaimTypes.Role, theModel.Role),
                new Claim(ClaimTypes.Version, version),
                new Claim(ClaimTypes.DateOfBirth, updateTime)
                };
            var tokenName = _config.GetSection("AppSettings:Token").Value;
            var key = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(tokenName));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token)
            });

        }

    }
}