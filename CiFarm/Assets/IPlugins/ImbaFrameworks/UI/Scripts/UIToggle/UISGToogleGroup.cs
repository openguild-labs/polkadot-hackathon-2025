using UnityEngine;
using System.Collections;


namespace Imba.UI
{
	public class UISGToogleGroup : MonoBehaviour
	{

		UISGToggle current;

		public UISGToggle Current
		{
			get { return current; }
		}

		public void ChangeTab(UISGToggle obj)
		{
			//Debug.LogError (obj.name);
			if (current != null)
				current.Visible = false;
			current = obj;
			current.Visible = true;
		}

		public void HideTab(UISGToggle obj)
		{
			if (obj == current)
				current = null;
			obj.Visible = false;
		}
	}
}