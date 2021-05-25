
using System.Threading.Tasks;
using API.Data.Interface.CMS;
using API.DTOs;
using API.Models.CMS;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository.CMS
{
    public class UserDAO: CMSCommonDAO<User>, IUserDAO
    {
        public UserDAO(CMSContext context) : base(context)
        {
        }
    }
}