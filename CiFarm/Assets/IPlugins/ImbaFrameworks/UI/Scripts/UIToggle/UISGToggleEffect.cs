using UnityEngine;
using System.Collections;

namespace Imba.UI
{
	public class UISGToggleEffect : MonoBehaviour
	{

		public virtual void Visable()
		{
			gameObject.SetActive(true);
		}

		public virtual void Disable()
		{
			gameObject.SetActive(false);
		}
	}
}