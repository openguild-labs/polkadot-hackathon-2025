using Imba.UI;

namespace CiFarm.Scripts.UI.Popups
{
    public class AnimalDetailPopupParam
    {
        public string tileId;
    }
    public class AnimalDetailPopup  : UIPopup
    {
        protected override void OnShowing()
        {
            base.OnShowing();
            if (Parameter != null)
            {
                var param = (StructuralDetailParam)Parameter;
  
            }

        }
        
        
    }
}