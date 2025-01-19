// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08

using UnityEngine;

using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using UnityEngine.Serialization;

namespace Imba.UI
{
	public enum AlertType
	{
		Normal,
		Error
	}

	/// <summary>
	/// Show alert message, move up and auto disappear
	/// </summary>
	public class UIAlertManager : MonoBehaviour
	{
		private const float SHOW_DELAY = 0.5f;

		[FormerlySerializedAs("AlertContainer")] public Transform alertContainer;
		[FormerlySerializedAs("AlertPrefab")] public UIAlertItem alertPrefab;


		[SerializeField]
		private float startY = -50;

		[SerializeField]
		private float alertTimeShow = 2.0f;


		private bool _showingAlert;

		private Queue<UIAlertItem> _alertItemPool = new Queue<UIAlertItem>();
		private Queue<AlertData> _pendingAlerts = new Queue<AlertData>();

		//private Vector3 verticalRectPanelHiddenPos;

		void Awake()
		{
			_showingAlert = false;
			//AlertContainer.gameObject.SetActive (false);
		}

		//NEW ALERT SYSTEM
		private struct AlertData
		{
			public object[] data;
			public AlertType type;

			public AlertData(object[] data, AlertType type)
			{
				this.data = data;
				this.type = type;
			}
		}

		public void ShowAlertMessage(string message, AlertType type = AlertType.Normal)
		{
			ShowAlertMessage(type, message);
		}

		public void ShowAlertMessage(AlertType type, params object[] data)
		{
			if (data == null || (_pendingAlerts.Count > 2)) return;

			AlertData alertData = new AlertData(data, type);
			_pendingAlerts.Enqueue(alertData);
			if (!_showingAlert)
			{
				StartCoroutine(DOShowAlert());
			}
		}

		public void EnqueueAlertItem(UIAlertItem item)
		{
			item.gameObject.SetActive(false);
			_alertItemPool.Enqueue(item);
		}


		private UIAlertItem GetItemFromPool()
		{
			UIAlertItem uiAlert = null;
			if (_alertItemPool.Count <= 0)
			{
				uiAlert = Instantiate(alertPrefab, alertContainer);
			}
			else
			{
				uiAlert = _alertItemPool.Dequeue();
			}

			uiAlert.gameObject.SetActive(true);
			return uiAlert;
		}



		private IEnumerator DOShowAlert()
		{
			_showingAlert = true;

			WaitForSeconds wait = new WaitForSeconds(SHOW_DELAY);
			while (_pendingAlerts.Count > 0)
			{
				AlertData alertData = _pendingAlerts.Dequeue();
				UIAlertItem item = GetItemFromPool();
				item.Show(alertTimeShow, startY, alertData.type, alertData.data);
				yield return wait;
			}

			_showingAlert = false;
		}
	}

}