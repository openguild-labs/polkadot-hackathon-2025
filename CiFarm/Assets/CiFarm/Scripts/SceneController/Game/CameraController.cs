using DG.Tweening;
using UnityEngine;
using UnityEngine.EventSystems;

namespace CiFarm.Scripts.SceneController.Game
{
    public class CameraController : MonoBehaviour
    {
        [SerializeField] private Camera mainCam;

        [Header("Zoom mechanic")]
        [SerializeField] private float zoomSpeed = 5f;

        [SerializeField] private float minZoom        = 5f;
        [SerializeField] private float maxZoom        = 20f;
        [SerializeField] private float zoomSmoothTime = 0.2f;

        public float targetZoom;
        public float zoomVelocity;

        [Header("Draging")]
        [SerializeField] private float dragSpeed = 1f;

        [SerializeField] private float dragSmoothTime = 0.2f;
        [SerializeField] private float dragLimitUp    = 10f;
        [SerializeField] private float dragLimitDown  = 10f;
        [SerializeField] private float dragLimitLeft  = 10f;
        [SerializeField] private float dragLimitRight = 10f;

        public Vector3 targetDrag;
        public bool    isDragging;

        public bool allowDrag = true;

        void Start()
        {
            targetZoom = mainCam.orthographicSize;
            targetDrag = mainCam.transform.position;
        }

        private void LateUpdate()
        {
            if (!allowDrag)
            {
                return;
            }

            if (EventSystem.current.IsPointerOverGameObject())
            {
                return;
            }

            HandleCameraDrag();
            HandleZoom();
        }

        void HandleCameraDrag()
        {
            if (Input.GetMouseButtonDown(0))
            {
                targetDrag = mainCam.ScreenToWorldPoint(Input.mousePosition);
                isDragging = true;
            }

            if (Input.GetMouseButton(0) && isDragging)
            {
                var currentPos = mainCam.ScreenToWorldPoint(Input.mousePosition);
                var difference = (targetDrag - currentPos) * dragSpeed;

                Vector3 targetPos = mainCam.transform.position + difference;

                targetPos.x = Mathf.Clamp(targetPos.x, dragLimitLeft, dragLimitRight);
                targetPos.y = Mathf.Clamp(targetPos.y, dragLimitDown, dragLimitUp);

                mainCam.transform.DOMove(targetPos, dragSmoothTime);
            }

            if (Input.GetMouseButtonUp(0))
            {
                isDragging = false;
            }
        }

        private void HandleZoom()
        {
            if (Input.touchSupported && Input.touchCount == 2)
            {
                var touchZero = Input.GetTouch(0);
                var touchOne  = Input.GetTouch(1);

                var touchZeroPrevPos = touchZero.position - touchZero.deltaPosition;
                var touchOnePrevPos  = touchOne.position - touchOne.deltaPosition;

                var prevTouchDeltaMag  = (touchZeroPrevPos - touchOnePrevPos).magnitude;
                var touchDeltaMag      = (touchZero.position - touchOne.position).magnitude;
                var deltaMagnitudeDiff = touchDeltaMag - prevTouchDeltaMag;

                targetZoom += deltaMagnitudeDiff * zoomSpeed * Time.deltaTime;
                targetZoom =  Mathf.Clamp(targetZoom, minZoom, maxZoom);
            }
            else
            {
                // Mouse scroll input for zoom (if applicable)
                var scrollInput = Input.GetAxis("Mouse ScrollWheel");

                if (scrollInput != 0f)
                {
                    targetZoom -= scrollInput * zoomSpeed;
                    targetZoom =  Mathf.Clamp(targetZoom, minZoom, maxZoom);
                }
            }

            mainCam.DOOrthoSize(targetZoom, zoomSmoothTime);
        }

        public void LockCamera()
        {
            allowDrag = false;
        }

        public void UnLockCamera()
        {
            allowDrag = true;
        }
    }
}