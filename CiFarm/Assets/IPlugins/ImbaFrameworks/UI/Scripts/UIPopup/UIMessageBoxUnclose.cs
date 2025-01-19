using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Imba.UI;
using TMPro;

public class UIMessageBoxUnclose : UIPopup
{

	public GameObject ButtonOK;
	public GameObject ButtonCancel;
	public GameObject ButtonYes;
	public GameObject ButtonNo;
	public GameObject ButtonRetry;

	public TextMeshProUGUI TextTitle;
	public TextMeshProUGUI TextMessage;


	public enum MessageBoxType
	{
		OK,
		OK_Cancel,
		Yes_No,
		Retry
	}

	public enum MessageBoxAction
	{
		Accept,
		Deny
	}

	public delegate bool OnMessageBoxAction(MessageBoxAction action);

	public class MessageBoxParam
	{
		public MessageBoxType MessageBoxType;

		public OnMessageBoxAction OnMessageBoxActionCallback;

		public string MessageTitle { get; set; }

		public string MessageBody { get; set; }
		public Action clickAction { get; set; }

		public bool ExcuteAccept()
		{
			if (OnMessageBoxActionCallback != null)
			{
				return OnMessageBoxActionCallback(MessageBoxAction.Accept);
			}
			return true;
		}

		public bool ExcuteDeny()
		{
			if (OnMessageBoxActionCallback != null)
			{
				return OnMessageBoxActionCallback(MessageBoxAction.Deny);
			}
			return true;
		}

	}

	public MessageBoxParam MessageBoxParameter
	{
		get
		{
			return Parameter as MessageBoxParam;
		}
		set
		{
			Parameter = value;
		}
	}

	public void OnOKClick()
	{
		if (MessageBoxParameter != null)
		{
			if (MessageBoxParameter.ExcuteAccept())
			{
				this.Hide();
			}
			MessageBoxParameter.clickAction?.Invoke();
		}

	}

	public void OnCancelClick()
	{
		if (MessageBoxParameter != null)
		{
			if (MessageBoxParameter.ExcuteDeny())
			{
				this.Hide();
			}
		}
	}

	public void OnYesClick()
	{
		if (MessageBoxParameter != null)
		{
			if (MessageBoxParameter.ExcuteAccept())
			{
				this.Hide();
			}
		}
	}

	public void OnNoClick()
	{
		if (MessageBoxParameter.ExcuteDeny())
		{
			this.Hide();
		}
	}

	public void OnRetryClick()
	{
		if (MessageBoxParameter != null)
		{
			if (MessageBoxParameter.ExcuteAccept())
			{
				this.Hide();
			}
		}
	}

	protected override void OnShowing()
	{
		base.OnShowing();

		SetupData();

	}

	void SetupData()
	{
		if (MessageBoxParameter == null)
		{
			Debug.LogError("Message box has no param??");
			return;
		}

		bool hasOK = MessageBoxParameter.MessageBoxType == MessageBoxType.OK ||
					 MessageBoxParameter.MessageBoxType == MessageBoxType.OK_Cancel;

		bool hasCancel = MessageBoxParameter.MessageBoxType == MessageBoxType.OK_Cancel;
		bool hasYes = MessageBoxParameter.MessageBoxType == MessageBoxType.Yes_No;
		bool hasNo = MessageBoxParameter.MessageBoxType == MessageBoxType.Yes_No;
		bool hasRetry = MessageBoxParameter.MessageBoxType == MessageBoxType.Retry;

		ButtonOK.SetActive(hasOK);
		ButtonCancel.SetActive(hasCancel);
		ButtonYes.SetActive(hasYes);
		ButtonNo.SetActive(hasNo);
		ButtonRetry.SetActive(hasRetry);

		TextTitle.text = MessageBoxParameter.MessageTitle;
		TextMessage.text = MessageBoxParameter.MessageBody;
	}

}
