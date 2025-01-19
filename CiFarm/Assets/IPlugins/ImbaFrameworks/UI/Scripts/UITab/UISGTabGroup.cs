using UnityEngine;
using System.Collections;

namespace Imba.UI
{
	public class UISGTabGroup : MonoBehaviour
	{

		UISGTab current;

		public UISGTab Current
		{
			get { return current; }
		}

		public void ChangeTab(UISGTab tab)
		{
			if (current != null)
				current.Interaction = true;
			current = tab;
			if (tab != null)
				tab.Interaction = false;
		}
	}
}