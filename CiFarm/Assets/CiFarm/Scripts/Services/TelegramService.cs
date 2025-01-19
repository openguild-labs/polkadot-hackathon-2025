using Imba.Utils;

namespace CiFarm.Scripts.Services.NakamaServices
{
    public class TelegramService : ManualSingletonMono<TelegramService>
    {   
        public string GenerateTelegramInvitationLink()
        {   
            return $"https://t.me/ciwallet_bot/ciwallet?startapp=${NakamaUserService.Instance.userId}";
        }
    }
}