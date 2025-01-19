using UnityEngine;
using System.Collections;

namespace Imba.UI
{
	public class UISGTabBaseEffect : MonoBehaviour
	{


		public void Play(bool enable)
		{
			if (enable)
				Enable();
			else
				Disable();
		}

		protected virtual void Enable()
		{

		}

		protected virtual void Disable()
		{

		}
	}
}