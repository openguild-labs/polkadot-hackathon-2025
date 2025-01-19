using UnityEngine;
using System.Collections;
using UnityEngine.UI;


namespace Imba.UI
{
	[RequireComponent(typeof(Button))]
	[ExecuteInEditMode]
	public class UISGTab : MonoBehaviour
	{

		public UISGTabGroup group;
		public UISGTabBaseEffect effect;
		public bool isDefault;
		public bool autoAddListener = true;
		Button btn;
		UIButton btnSg;

		public bool IsCurrentTab
		{
			get
			{
				if (btn != null)
					return !btn.interactable;
				return false;
			}
		}

		void Awake()
		{
			if (btn == null)
			{
				btn = GetComponent<Button>();
				btnSg = GetComponent<UIButton>();
				if (autoAddListener)
					btn.onClick.AddListener(OnBaseClick);
			}

			if (isDefault)
				OnBaseClick();
		}

		public bool Interaction
		{
			get { return btn.interactable; }
			set
			{
				if (btn == null)
					return;
				btn.interactable = value;

				if (btnSg != null)
					btnSg.Interactable = value;

				if (effect != null)
					effect.Play(value);
			}
		}

		public void OnBaseClick()
		{
			if (btn == null)
			{
				btn = GetComponent<Button>();
				btn.onClick.AddListener(OnBaseClick);
			}

			if (group != null)
				ActiveMe();
		}

		public void ActiveMe()
		{
			group.ChangeTab(this);
		}
	}
}