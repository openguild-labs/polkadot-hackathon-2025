using System;
using UnityEngine;
using System.Collections;
using UnityEditor;
using UnityEngine.UI;
using System.Linq;

using Imba.UI;
using Imba.UI.Animation;
using UnityEditor.SceneManagement;

namespace Imba.Editor.UI
{
    [CustomEditor(typeof(UIPopupController))]
    public class UIPopupControllerEditor : UIBaseEditor
    {
        //public const int TARGET_W = 1138;
        //public const int TARGET_H = 640;
        //static readonly string CONTAINER_NAME = "ZPreloadUI";

        static readonly string SAMPLE_PREFAB_PATH = "Assets/ImbaFrameworks/UI/Prefabs/SamplePopup.prefab";

        private UIPopupController m_target;

        private UIPopupController PopupController
        {
            get
            {
                if (m_target != null) return m_target;
                m_target = (UIPopupController) target;
                return m_target;
            }
        }
        private SerializedProperty
            m_popupName,
            m_afterHideBehaviour,
            m_autoHideAfterShowDelay,
            m_autoSelectButtonAfterShow,
            m_buttons,
            m_canvasName,
            m_container,
            m_customCanvasName,
            m_data,
            m_destroyAfterHide,
            m_displayTarget,
            m_hideBehavior,
            m_hideInstantAnimation,
            m_hideOnBackButton,
            m_hideOnClickAnywhere,
            m_hideOnClickContainer,
            m_hideOnClickOverlay,
            m_hideProgressor,
            m_images,
            m_labels,
            m_onInverseVisibilityChanged,
            m_onVisibilityChanged,
            m_overlay,
            m_selectedButton,
            m_showBehavior,
            m_showInstantAnimation,
            m_showProgressor,
            m_updateHideProgressorOnShow,
            m_updateShowProgressorOnHide;
        
        protected override void LoadSerializedProperty()
        {
            base.LoadSerializedProperty();
            m_popupName = GetProperty("PopupName");
            m_afterHideBehaviour =  GetProperty("AfterHideBehaviour");
            
            m_hideBehavior = GetProperty(PropertyName.HideBehavior);
            m_hideInstantAnimation = GetProperty(PropertyName.InstantAnimation, m_hideBehavior);

            m_showBehavior = GetProperty(PropertyName.ShowBehavior);
            m_showInstantAnimation = GetProperty(PropertyName.InstantAnimation, m_showBehavior);

        }

        
        public override void OnInspectorGUI()
        {
            //base.OnInspectorGUI();
            
        
            
            //Popup Setting
            EditorGUILayout.PropertyField(m_popupName, new GUIContent("Popup Name"));
            EditorGUILayout.PropertyField(m_afterHideBehaviour, new GUIContent("After Hide Behaviour"));
            PopupController.AlwaysOnTop = EditorGUILayout.Toggle("Always On Top", PopupController.AlwaysOnTop);
            PopupController.DeactiveGameObjectWhenHide = EditorGUILayout.Toggle("Deactive Game Object When Hide", PopupController.DeactiveGameObjectWhenHide);
            PopupController.ShowOverlay = EditorGUILayout.Toggle("Show Overlay", PopupController.ShowOverlay);
            PopupController.CloseByBackButton = EditorGUILayout.Toggle("Close By Back Button", PopupController.CloseByBackButton);
            PopupController.CloseByClickOutside = EditorGUILayout.Toggle("Close By Click Overlay", PopupController.CloseByClickOutside);
            PopupController.DestroyOnLoadScene = EditorGUILayout.Toggle("Destroy On LoadScene", PopupController.DestroyOnLoadScene);
            PopupController.FadeContent = EditorGUILayout.Toggle("Fade Content", PopupController.FadeContent);
            
                   
            GUILayout.BeginHorizontal();
            if (GUILayout.Button("Open",  GUILayout.Width(100), GUILayout.Height(40)))
            {
                OpenPopupPrefab();
            }

            if (GUILayout.Button("Select",  GUILayout.Width(100), GUILayout.Height(40)))
            {
                SelectPopupPrefab();
            }

            if (GUILayout.Button("Create",  GUILayout.Width(100), GUILayout.Height(40)))
            {
                CreatePopupPrefab();
            }

            GUILayout.EndHorizontal();
            
            //Animation
            GUILayout.Space(10);
            GUILayout.Label("ANIMATION");
            int indent = EditorGUI.indentLevel;
            EditorGUI.indentLevel = 1;
            DrawBehaviors();
            
            EditorGUI.indentLevel = indent;

            
            PopupController.CustomResourcesLocation = EditorGUILayout.TextField("Custom Resources Location", PopupController.CustomResourcesLocation);
         
            
            serializedObject.ApplyModifiedProperties();
            
            
            if (GUI.changed)
            {
                EditorUtility.SetDirty(PopupController);
                EditorSceneManager.MarkSceneDirty(PopupController.gameObject.scene);
            }

        }
        
        private void DrawBehaviors()
        {
            //int indent = EditorGUI.indentLevel;
            //EditorGUI.indentLevel = 2;
            GUILayout.Space(10);
            DrawBehavior("Show Behavior", PopupController.ShowBehavior, m_showBehavior);
            GUILayout.Space(10);
            DrawBehavior("Hide Behavior", PopupController.HideBehavior, m_hideBehavior);
            GUILayout.Space(10);
            //EditorGUI.indentLevel = indent;
        }
        
        private void DrawBehavior(string behaviorName, UIPopupBehavior behavior, SerializedProperty behaviorProperty)
        {
            SerializedProperty animationProperty = GetProperty(PropertyName.Animation, behaviorProperty);
            var animationType = (AnimationType) GetProperty(PropertyName.AnimationType, animationProperty).enumValueIndex;
            SerializedProperty startProperty = GetProperty(PropertyName.OnStart, behaviorProperty);
            SerializedProperty finishedProperty = GetProperty(PropertyName.OnFinished, behaviorProperty);
           // SerializedProperty instantAnimationProperty1 = null;
            SerializedProperty instantAnimationProperty = null;

            switch (animationType)
            {
                case AnimationType.Show:
                    instantAnimationProperty = m_showInstantAnimation;

                    break;
                case AnimationType.Hide:
                    instantAnimationProperty = m_hideInstantAnimation;
                    break;
            }
            
            EditorGUILayout.LabelField(behaviorName.ToUpper());
            DrawBehaviorAnimation(behavior, animationProperty, instantAnimationProperty);
            GUILayout.Space(5);
            EditorGUILayout.LabelField("ACTIONS");
            DrawBehaviorActions(behavior.OnStart, startProperty, animationType + "Behavior.OnStart");
            GUILayout.Space(5);
            DrawBehaviorActions(behavior.OnFinished, finishedProperty, animationType + "Behavior.OnFinished");
            GUILayout.Space(10);
        }


        private void DrawPreviewAnimationButtons(SerializedObject serializedObject, UIPopup popup, UIPopupBehavior popupBehavior)
        {
            
                GUILayout.BeginHorizontal();
                {

                    bool enabled = GUI.enabled;
                    GUI.enabled = !EditorApplication.isPlayingOrWillChangePlaymode;


                    GUILayout.Space(50);
                    if (GUILayout.Button("Play", GUILayout.Width(100), GUILayout.Height(30)))
                    {
                        PreviewAnim(popupBehavior.Animation);
                    }


                    if (GUILayout.Button("Stop", GUILayout.Width(100), GUILayout.Height(30)))
                    {
                        StopPreviewAnim();
                    }


                    GUI.enabled = enabled;

                    GUILayout.FlexibleSpace();
                }
                GUILayout.EndHorizontal();
            
        }

        private void DrawBehaviorActions(UIAction actions, SerializedProperty actionsProperty, string unityEventDisplayPath)
        {
            SerializedProperty unityEventProperty = GetProperty(PropertyName.Event, actionsProperty);

            int indent = EditorGUI.indentLevel;
            EditorGUI.indentLevel = 2;
//            actions.HasSound = EditorGUILayout.Toggle("Has Sound", actions.HasSound);
            EditorGUILayout.PropertyField(unityEventProperty, new GUIContent(unityEventDisplayPath));
            EditorGUI.indentLevel = indent;

        }
        
        private void DrawBehaviorAnimation(UIPopupBehavior behavior, SerializedProperty animationProperty, SerializedProperty instantAnimationProperty)
        {
           
            SerializedProperty move = GetProperty(PropertyName.Move, animationProperty);
            SerializedProperty rotate = GetProperty(PropertyName.Rotate, animationProperty);
            SerializedProperty scale = GetProperty(PropertyName.Scale, animationProperty);
            SerializedProperty fade = GetProperty(PropertyName.Fade, animationProperty);

            
            int indent = EditorGUI.indentLevel;
            EditorGUI.indentLevel = 2;
            EditorGUILayout.PropertyField(instantAnimationProperty, new GUIContent("Instant Animation"));

            GUILayout.BeginVertical();
            
            
            
            if (!instantAnimationProperty.boolValue)
            {

                if (behavior.Animation.Enabled)
                {
                    DrawPreviewAnimationButtons(serializedObject, PopupController.Popup, behavior);
                }

                DrawAnimation(scale, "Scale");
                DrawAnimation(move, "Move");
                DrawAnimation(rotate, "Rotate");
                DrawAnimation(fade, "Fade");
            }
            GUILayout.EndVertical();

            EditorGUI.indentLevel = indent;

        }
        
        private void DrawAnimation(SerializedProperty prop, string label)
        {
            SerializedProperty enabledProperty = GetProperty(PropertyName.Enabled, prop);
            EditorGUILayout.PropertyField(enabledProperty, new GUIContent(label));
            if (enabledProperty.boolValue)
            {
                EditorGUILayout.PropertyField(prop, new GUIContent(label));
                GUILayout.Space(10);
            }
        }

        private void SelectPopupPrefab()
        {
            UIPopupController controller = target as UIPopupController;
            string prefabPath = controller.CustomResourcesLocation + UIPopupManager.POPUP_PREFAB_LOCATION +  controller.PopupName.ToString() + ".prefab";
            GameObject prefab = AssetDatabase.LoadAssetAtPath(prefabPath, typeof(GameObject)) as GameObject;

            // Select the object in the project folder
            Selection.activeObject = prefab;

            // Also flash the folder yellow to highlight it
            EditorGUIUtility.PingObject(prefab);
        }

        private void OpenPopupPrefab()
        {
            UIPopupController controller = target as UIPopupController;
            string prefabPath = controller.CustomResourcesLocation + UIPopupManager.POPUP_PREFAB_LOCATION + controller.PopupName.ToString() + ".prefab";
            GameObject prefab = AssetDatabase.LoadAssetAtPath(prefabPath, typeof(GameObject)) as GameObject;
            if (prefab)
            {
                AssetDatabase.OpenAsset(prefab);
            }
            else
            {
                string msg = string.Format("Not found prefab {0} at {1}", controller.PopupName, prefabPath);
                EditorUtility.DisplayDialog("ERORR", msg , "Ok");
                Debug.LogError(msg);
            }
        }

        private void CreatePopupPrefab()
        {
            UIPopupController controller = target as UIPopupController;
            string prefabPath = controller.CustomResourcesLocation + UIPopupManager.POPUP_PREFAB_LOCATION + controller.PopupName.ToString() + ".prefab";
            GameObject prefab = AssetDatabase.LoadAssetAtPath(prefabPath, typeof(GameObject)) as GameObject;
            if (prefab)
            {
                string msg = string.Format("Prefab {0} already existed at {1}", controller.PopupName, prefabPath);
                EditorUtility.DisplayDialog("ERORR", msg, "OK");
                Debug.LogError(msg);
            }
            else
            {
                GameObject sample = AssetDatabase.LoadAssetAtPath(SAMPLE_PREFAB_PATH, typeof(GameObject)) as GameObject;
                GameObject popupIntsance = GameObject.Instantiate(sample) as GameObject;
                PrefabUtility.SaveAsPrefabAssetAndConnect(popupIntsance, prefabPath, InteractionMode.UserAction);
                GameObject.DestroyImmediate(popupIntsance);

                string msg = string.Format("Created prefab {0} at {1}", controller.PopupName, prefabPath);
                Debug.Log(msg);
                EditorUtility.DisplayDialog( "SUCCESS",msg, "OK");

            }
        }

        private void PreviewAnim(UIAnimation anim)
        {
            UIPopup popup = LoadPopup();
            
            if(popup)
                UIAnimatorUtils.PreviewPopupAnimation(popup, anim);
        }


        private void StopPreviewAnim(bool destroyPreviewer = true)
        {
            GameObject dialogInstance = FindPopup();
            if (dialogInstance)
                DestroyImmediate(dialogInstance);
            
            GameObject zLoader = UILoader();

            if (zLoader && destroyPreviewer)
                DestroyImmediate(zLoader);
           
        }


        
        private UIPopup LoadPopup(bool select = false)
        {
            
            UIPopupController controller = target as UIPopupController;

            string location = controller.CustomResourcesLocation + UIPopupManager.POPUP_PREFAB_LOCATION;
                
            GameObject zLoader = UILoader();

            if (zLoader)
            {
                GameObject dialogInstance = FindPopup();

                if (!dialogInstance)
                {
                    string prefabPath = location + controller.PopupName.ToString() + ".prefab";
                    GameObject newInstance = AssetDatabase.LoadAssetAtPath(prefabPath, typeof(GameObject)) as GameObject;
                    if (newInstance)
                    {
                        dialogInstance = PrefabUtility.InstantiatePrefab(newInstance) as GameObject;
                        dialogInstance.gameObject.name = controller.PopupName.ToString();
                        dialogInstance.transform.SetParent(zLoader.transform, false);
                    }
                    else
                    {
                        Debug.LogError("Not found " + prefabPath);
                    }
                }
                else
                {
                    dialogInstance.gameObject.name = controller.PopupName.ToString();
                    dialogInstance.transform.SetParent(zLoader.transform, false);
                }

                if (dialogInstance)
                {
                    if(select)
                        Selection.activeGameObject = dialogInstance;
                    return dialogInstance.GetComponent<UIPopup>();
                }
            }
            return null;
        }


        private GameObject UILoader()
        {
            GameObject zLoader = GameObject.Find("PopupPreview");
            if (!zLoader)
            {
                zLoader = new GameObject("PopupPreview");
                Canvas canvas = zLoader.AddComponent<Canvas>();
                CanvasScaler scaler = zLoader.AddComponent<UnityEngine.UI.CanvasScaler>();
                zLoader.AddComponent<GraphicRaycaster>();

                canvas.planeDistance = 1;
                canvas.renderMode = RenderMode.ScreenSpaceOverlay;
                canvas.sortingOrder = 100;
                scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
                scaler.referenceResolution = new Vector2(1280, 720);
                scaler.screenMatchMode = CanvasScaler.ScreenMatchMode.Expand;
            }
            return zLoader;
        }

        private GameObject FindPopup()
        {
            UIPopupController controller = target as UIPopupController;
            GameObject zLoader = UILoader();
            Transform tmp = zLoader.transform.Find(controller.PopupName.ToString());
            return tmp ? tmp.gameObject : null;
        }
    }
}