// using System.Threading.Tasks;
// using Solana.Unity.SDK;
// using Solana.Unity.Wallet;
// using UnityEngine.Events;
// using Utility.Singleton;
//
// namespace Services
// {
//     public class SolanaService : PersistentMonoSingleton<SolanaService>
//     {
//         protected override void OnInitialized()
//         {
//             base.OnInitialized();
//             solanaSdk = gameObject.AddComponent<Web3>();
//         }
//
//         public UnityAction<Account> OnConnectWallet;
//         public UnityAction<string> OnError;
//         private Web3 solanaSdk;
//
//         public void AssignCallBack(UnityAction<Account> onConnectCallBack, UnityAction<string> onErrorCallBack)
//         {
//             OnConnectWallet = onConnectCallBack;
//             OnError = onErrorCallBack;
//         }
//
//         public void ClearCallBack()
//         {
//             OnConnectWallet = null;
//             OnError = null;
//         }
//
//         public async void LoginChecker(string password)
//         {
//             var account = await solanaSdk.LoginInGameWallet(password);
//             CheckAccount(account);
//         }
//
//         public async Task LoginCheckerSms()
//         {
//             var account = await solanaSdk.LoginWalletAdapter();
//             CheckAccount(account);
//         }
//
//         public async void LoginCheckerWeb3Auth(Provider provider)
//         {
//             var account = await solanaSdk.LoginWeb3Auth(provider);
//             CheckAccount(account);
//         }
//
//         public async void LoginCheckerWalletAdapter()
//         {
//             if (solanaSdk == null) return;
//             var account = await solanaSdk.LoginWalletAdapter();
//             CheckAccount(account);
//         }
//
//         private void CheckAccount(Account account)
//         {
//             if (account != null)
//             {
//                 OnConnectWallet.Invoke(account);
//             }
//             else
//             {
//                 OnError.Invoke("Connect fail");
//             }
//         }
//     }
// }