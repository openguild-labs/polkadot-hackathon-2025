// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08

using UnityEngine;


using Imba.UI.Animation;
using UnityEditor;

using Imba.UI;
using Imba.Audio;
using UnityEditor.SceneManagement;

namespace Imba.Editor.UI
{
    [CustomEditor(typeof(UIButton), true)]
    public class UIButtonEditor : UIBaseEditor
    {
        private UIButton _button;

        private UIButton Button
        {
            get
            {
                if (_button != null) return _button;
                _button = (UIButton) target;
                return _button;
            }
        }

        private SerializedProperty
            _allowMultipleClicks,
            _disableButtonBetweenClicksInterval,
            _doubleClickRegisterInterval,
            _longClickRegisterInterval,
            _onPointerDown,
            _onPointerUp,
            _onClick,
            _onDoubleClick,
            _onLongClick;
        
        
        protected override void LoadSerializedProperty()
        {
//            Debug.Log("LoadSerializedProperty");
            _allowMultipleClicks = GetProperty(PropertyName.AllowMultipleClicks);
            _disableButtonBetweenClicksInterval = GetProperty(PropertyName.DisableButtonBetweenClicksInterval);
            _doubleClickRegisterInterval = GetProperty(PropertyName.DoubleClickRegisterInterval);
            _longClickRegisterInterval = GetProperty(PropertyName.LongClickRegisterInterval);
            _onPointerDown = GetProperty(PropertyName.OnPointerDown);
            _onPointerUp = GetProperty(PropertyName.OnPointerUp);
            _onClick = GetProperty(PropertyName.OnClick);
            _onDoubleClick = GetProperty(PropertyName.OnDoubleClick);
            _onLongClick = GetProperty(PropertyName.OnLongClick);
            
          //  Debug.Log("LoadSerializedProperty");
        }
        
        public override void OnInspectorGUI()
        {
            //UIButton button = target as UIButton;

            GUILayout.BeginVertical();
            DrawBasicProperties();

            GUILayout.Space(10);
            
            DrawBehaviors();
            
            GUILayout.EndVertical();
            
            serializedObject.ApplyModifiedProperties();
            
            if (GUI.changed)
            {
                EditorUtility.SetDirty(Button);
                EditorSceneManager.MarkSceneDirty(Button.gameObject.scene);
            }
        }

        private void DrawBasicProperties()
        {
            GUILayout.BeginHorizontal();
            {
                EditorGUILayout.PropertyField(_allowMultipleClicks);
                bool enabledState = GUI.enabled;
                GUI.enabled = !_allowMultipleClicks.boolValue;
                EditorGUILayout.PropertyField(_disableButtonBetweenClicksInterval);
                GUI.enabled = enabledState;
                
                
            }
            GUILayout.EndHorizontal();
            
            Button.IsBackButton = EditorGUILayout.Toggle("Is Back Button", Button.IsBackButton);
        }
        
        private void DrawBehaviors()
        {
            GUILayout.Label(new GUIContent("BEHAVIOURS"), GUIStyle.none);
            GUILayout.Space(10);

            //int indent = EditorGUI.indentLevel;
            EditorGUI.indentLevel = 1;
            
            GUILayout.BeginVertical();
            DrawBehavior("OnClick", Button.OnClick, _onClick);
            DrawBehavior("OnPointerDown", Button.OnPointerDown, _onPointerDown);
            DrawBehavior("OnPointerUp", Button.OnPointerUp, _onPointerUp);
            DrawBehavior("OnDoubleClick", Button.OnDoubleClick, _onDoubleClick);
            DrawBehavior("OnLongClick", Button.OnLongClick, _onLongClick); 
            GUILayout.EndVertical();
            
            EditorGUI.indentLevel = 1;
        }

        private void DrawButtonBehaviorDisableInterval(SerializedProperty behavior)
        {
           
            EditorGUILayout.PropertyField(GetProperty(PropertyName.DisableInterval, behavior));
                  
        }

        /// <summary>
        /// Draw button behavior inspector
        /// </summary>
        /// <param name="behaviorName"></param>
        /// <param name="behavior"></param>
        /// <param name="behaviorProperty"></param>
        private void DrawBehavior(string behaviorName, UIButtonBehavior behavior, SerializedProperty behaviorProperty)
        {
            // GUILayout.Label(behaviorName);
            SerializedProperty enabledProperty = GetProperty(PropertyName.Enabled, behaviorProperty);
            SerializedProperty onTriggerProperty = GetProperty(PropertyName.OnTrigger, behaviorProperty);
            //SerializedProperty buttonAnimationTypeProperty =
                //GetProperty(PropertyName.ButtonAnimationType, behaviorProperty);
           // var buttonAnimationType = (ButtonAnimationType) buttonAnimationTypeProperty.enumValueIndex;

           
            EditorGUILayout.PropertyField(enabledProperty, new GUIContent(behaviorName));

            //bool enabledState = GUI.enabled;
            //GUI.enabled = enabledProperty.boolValue;
            if (enabledProperty.boolValue)
            {
               
                int indent = EditorGUI.indentLevel;
                EditorGUI.indentLevel = 2;
                GUILayout.BeginVertical();

                switch (behavior.BehaviorType)
                {
                    case UIButtonBehaviorType.OnClick:

                        break;
                    case UIButtonBehaviorType.OnDoubleClick:

                        EditorGUILayout.PropertyField(_doubleClickRegisterInterval);

                        break;
                    case UIButtonBehaviorType.OnLongClick:

                        EditorGUILayout.PropertyField(_longClickRegisterInterval);

                        break;
                    case UIButtonBehaviorType.OnPointerEnter:

                        DrawButtonBehaviorDisableInterval(behaviorProperty);

                        break;
                    case UIButtonBehaviorType.OnPointerExit:

                        DrawButtonBehaviorDisableInterval(behaviorProperty);

                        break;
                    case UIButtonBehaviorType.OnPointerDown:

                        break;
                    case UIButtonBehaviorType.OnPointerUp:

                        break;
                }

               // enabledState = GUI.enabled;
                GUI.enabled = enabledProperty.boolValue;
                DrawButtonBehaviorAnimation(behavior, behaviorProperty);
                GUILayout.Space(20);
                DrawBehaviorActions(behavior.OnTrigger, onTriggerProperty,
                    behaviorName + "." + PropertyName.OnTrigger);
               // GUI.enabled = enabledState;

                GUILayout.EndVertical();
                
                EditorGUI.indentLevel = indent;
                GUILayout.Space(10);
            }
        }

        private void DrawBehaviorActions(UIAction actions, SerializedProperty actionsProperty, string unityEventDisplayPath)
        {
            SerializedProperty unityEventProperty = GetProperty(PropertyName.Event, actionsProperty);

            EditorGUILayout.LabelField("ACTION");
            int indent = EditorGUI.indentLevel;
            EditorGUI.indentLevel = 3;
            //actions.HasSound = EditorGUILayout.Toggle("Has Sound", actions.HasSound);
            actions.AudioName = (AudioName)EditorGUILayout.EnumPopup("Sound", actions.AudioName);
            EditorGUILayout.PropertyField(unityEventProperty, new GUIContent("OnTriggerEvent"));
            EditorGUI.indentLevel = indent;

        }

        /// <summary>
        /// Draw button behavior animation inspector
        /// </summary>
        /// <param name="behavior"></param>
        /// <param name="behaviorProperty"></param>
        private void DrawButtonBehaviorAnimation(UIButtonBehavior behavior, SerializedProperty behaviorProperty)
        {
            SerializedProperty buttonAnimationType = GetProperty(PropertyName.ButtonAnimationType.ToString(), behaviorProperty);
            var selectedAnimationType = (ButtonAnimationType) buttonAnimationType.enumValueIndex;
            
            GUILayout.BeginVertical();
            {
                
                EditorGUILayout.LabelField("ANIMATION");
                int indent = EditorGUI.indentLevel;
                EditorGUI.indentLevel = 3;
                EditorGUILayout.PropertyField(buttonAnimationType );
                
                DrawPreviewAnimationButtons(serializedObject, Button, behavior);
                
                switch (selectedAnimationType)
                {
                    case ButtonAnimationType.Punch:
                        DrawBehaviorAnimationsProperty(GetProperty(PropertyName.PunchAnimation, behaviorProperty), selectedAnimationType);
                        break;
                    case ButtonAnimationType.State:
                        DrawBehaviorAnimationsProperty(GetProperty(PropertyName.StateAnimation, behaviorProperty), selectedAnimationType);
                        break;
                   
                }
                EditorGUI.indentLevel = indent;
                
            }
            GUILayout.EndVertical();
        }
        
        private void DrawBehaviorAnimationsProperty(SerializedProperty property, ButtonAnimationType animationType)
        {
            SerializedProperty move = GetProperty(PropertyName.Move, property);
            SerializedProperty rotate = GetProperty(PropertyName.Rotate, property);
            SerializedProperty scale = GetProperty(PropertyName.Scale, property);
            SerializedProperty fade = GetProperty(PropertyName.Fade, property);;

            GUILayout.Space(10);

            DrawAnimation(scale, "Scale");
            DrawAnimation(move, "Move");
            DrawAnimation(rotate, "Rotate");
            DrawAnimation(fade, "Fade");
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
        
        
        private void DrawPreviewAnimationButtons(SerializedObject serializedObject, UIButton button, UIButtonBehavior buttonBehavior)
        {
            UIAnimation animation = null;
            switch (buttonBehavior.ButtonAnimationType)
            {
                case ButtonAnimationType.Punch:
                    animation = buttonBehavior.PunchAnimation;
                    break;
                case ButtonAnimationType.State:
                    animation = buttonBehavior.StateAnimation;
                    break;
              
            }

           
           
            GUILayout.BeginHorizontal();
            {
               
                bool enabled = GUI.enabled;
                GUI.enabled = !EditorApplication.isPlayingOrWillChangePlaymode;

            
                GUILayout.Space(50);
                if (GUILayout.Button("Play",GUILayout.Width(100), GUILayout.Height(40)))
                {
                    UIAnimatorUtils.PreviewButtonAnimation(animation, button.RectTransform, button.CanvasGroup);
                }
                
                
                if (GUILayout.Button("Stop",GUILayout.Width(100), GUILayout.Height(40)))
                {
                    UIAnimatorUtils.StopButtonPreview(button.RectTransform, button.CanvasGroup);
                }
               

                GUI.enabled = enabled;

                GUILayout.FlexibleSpace();
            }
            GUILayout.EndHorizontal();
        }
    }
}