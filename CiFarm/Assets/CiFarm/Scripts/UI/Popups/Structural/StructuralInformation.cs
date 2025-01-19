using TMPro;
using UnityEngine;

namespace CiFarm.Scripts.UI.Popups.Structural
{
    public class StructuralInformation : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI labelText;
        [SerializeField] private TextMeshProUGUI detailText;

        private void SetStructuralInformation(string label, string detail)
        {
            labelText.text  = label;
            detailText.text = detail;
        }
    }
}