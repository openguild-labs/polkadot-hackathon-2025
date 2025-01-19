
using UnityEngine;
using UnityEditor;

using Imba.UI;
using Imba.UI.Animation;
using UnityEditor.SceneManagement;

namespace Imba.Editor.UI
{
    [CustomEditor(typeof(UIAnimationComponent))]
    public class UIAnimationComponentEditor : UIBaseEditor
    {
        private UIAnimationComponent m_target;

        private UIAnimationComponent Target
        {
            get
            {
                if (m_target != null) return m_target;
                m_target = (UIAnimationComponent) target;
                return m_target;
            }
        }
        private SerializedProperty
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
            m_updateShowProgressorOnHide,
            m_viewName;
        
        protected override void LoadSerializedProperty()
        {
            base.LoadSerializedProperty();
            
            m_hideBehavior = GetProperty(PropertyName.HideBehavior);
            m_hideInstantAnimation = GetProperty(PropertyName.InstantAnimation, m_hideBehavior);

            m_showBehavior = GetProperty(PropertyName.ShowBehavior);
            m_showInstantAnimation = GetProperty(PropertyName.InstantAnimation, m_showBehavior);
            
        }

        
        public override void OnInspectorGUI()
        {
            //base.OnInspectorGUI();
            serializedObject.Update();
            serializedObject.ApplyModifiedProperties();
            Target.DeactiveGameObjectWhenHide = EditorGUILayout.Toggle("Deactive Game Object When Hide", Target.DeactiveGameObjectWhenHide);
            
            //Animation
            GUILayout.Space(10);
            GUILayout.Label("ANIMATION");
            int indent = EditorGUI.indentLevel;
            EditorGUI.indentLevel = 1;
            DrawBehaviors();
            
            EditorGUI.indentLevel = indent;
            
            serializedObject.ApplyModifiedProperties();
            
            if (GUI.changed)
            {
                EditorUtility.SetDirty(Target);
                EditorSceneManager.MarkSceneDirty(Target.gameObject.scene);
            }
        }
        
        private void DrawBehaviors()
        {
            //int indent = EditorGUI.indentLevel;
            //EditorGUI.indentLevel = 2;
            GUILayout.Space(10);
            DrawBehavior("Show Behavior", Target.ShowBehavior, m_showBehavior);
            GUILayout.Space(10);
            DrawBehavior("Hide Behavior", Target.HideBehavior, m_hideBehavior);
            GUILayout.Space(10);
            //EditorGUI.indentLevel = indent;
        }
        
        private void DrawBehavior(string behaviorName, UIViewBehavior behavior, SerializedProperty behaviorProperty)
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


        private void DrawPreviewAnimationButtons(SerializedObject serializedObject, UIAnimationComponent view, UIViewBehavior viewBehavior)
        {
            
            GUILayout.BeginHorizontal();
            {
               
                bool enabled = GUI.enabled;
                GUI.enabled = !EditorApplication.isPlayingOrWillChangePlaymode;

            
                GUILayout.Space(50);
                if (GUILayout.Button("Play", GUILayout.Width(100), GUILayout.Height(30)))
                {
                   PreviewAnim(viewBehavior.Animation, view);
                }
                
                
                if (GUILayout.Button("Stop", GUILayout.Width(100), GUILayout.Height(30)))
                {
                    StopPreviewAnim(view);
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
            //actions.HasSound = EditorGUILayout.Toggle("Has Sound", actions.HasSound);
            EditorGUILayout.PropertyField(unityEventProperty, new GUIContent(unityEventDisplayPath));
            EditorGUI.indentLevel = indent;

        }
        
        private void DrawBehaviorAnimation(UIViewBehavior behavior, SerializedProperty animationProperty, SerializedProperty instantAnimationProperty)
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
                    DrawPreviewAnimationButtons(serializedObject, Target, behavior);
                
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
        
        private void PreviewAnim(UIAnimation anim, UIAnimationComponent view)
        {
            Debug.Log("PreviewAnim " + view.name);
            if(view)
                UIAnimatorUtils.PreviewAnimation(view, anim);
        }


        private void StopPreviewAnim(UIAnimationComponent view)
        {
            UIAnimatorUtils.StopPreview(view);
           
        }
    }
}
