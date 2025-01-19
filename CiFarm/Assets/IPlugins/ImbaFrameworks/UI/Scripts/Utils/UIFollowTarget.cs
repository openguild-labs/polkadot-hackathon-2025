using UnityEngine;
using System.Collections;


namespace Imba.UI
{
	[ExecuteInEditMode]
	public class UIFollowTarget : MonoBehaviour
	{
		public Transform target;
		public Canvas canvas;
		public Vector3 offset;

		public RenderMode CanvasRenderMode
		{
			get
			{
				if (canvas)
					return canvas.renderMode;
				return RenderMode.WorldSpace;
			}
		}

		void Start()
		{
			if (!canvas)
			{
				canvas = GetComponentInParent<Canvas>();
			}
		}

#if !UNITY_EDITOR
		Vector3 oldTargetPos = new Vector3(-10000, 0, 0);
		float oldCameraSize;
		Vector3 oldCameraPos;
		Transform oldTarget;
#endif

		void Update()
		{
			var cameraMain = Camera.main;


#if !UNITY_EDITOR
			if (!target || !canvas || cameraMain == null ||
			    (oldTarget == target && oldTargetPos == target.position && oldCameraSize == cameraMain.orthographicSize &&
			     oldCameraPos == cameraMain.transform.position))
				return;
			oldTargetPos = target.position;
			oldCameraSize = cameraMain.orthographicSize;
			oldCameraPos = cameraMain.transform.position;
#else
		if (target == null || cameraMain == null)
			return;
#endif
			var targetPosition = Vector3.zero;
			// world pos
			targetPosition = target.position + offset;
			if (CanvasRenderMode == RenderMode.ScreenSpaceOverlay)
			{
				transform.position = cameraMain.WorldToScreenPoint(targetPosition);
			}
			else if (CanvasRenderMode == RenderMode.ScreenSpaceCamera)
			{
				Vector2 screenPos = UIFollowTarget.GetScreenPosition(transform, targetPosition, canvas, cameraMain);
				transform.localPosition = screenPos;
			}
			else
			{
				transform.position = targetPosition;
			}

		}

		public void SetFollowTarget(Transform target)
		{
			this.target = target;
			Update();
		}

		public void ForgetTarget()
		{
			SetFollowTarget(null);
		}

		public static Vector3 GetScreenPosition(Transform transform, Vector3 targetPos, Canvas canvas, Camera cam)
		{
			RectTransform rect = canvas.transform as RectTransform;
			Vector3 pos;
			float width = rect.sizeDelta.x;
			float height = rect.sizeDelta.y;
			Vector3 screenPos = cam.WorldToScreenPoint(targetPos);
			float x = screenPos.x / Screen.width;
			float y = screenPos.y / Screen.height;
			pos = new Vector3(width * x - width / 2, y * height - height / 2);
			return pos;
		}
	}
}