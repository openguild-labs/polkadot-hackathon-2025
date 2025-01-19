// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08

using System;
using UnityEditor;
using UnityEngine;
//using PropertyName = Imba.UI.PropertyName;
using Imba.UI.Animation;

namespace Imba.Editor.UI
{
    public class BaseAnimationDrawer : PropertyDrawer
    {
        private AnimationType _animationType;
        
        public override void OnGUI(Rect position, SerializedProperty property, GUIContent label) { }

        protected SerializedProperty GetProperty(PropertyName propertyName, SerializedProperty parentProperty)
        {
            SerializedProperty s = parentProperty.FindPropertyRelative(propertyName.ToString());
            if (s == null)
            {
                Debug.LogError("Property '" + propertyName + "' was not found.");
                return null;
            }
            return s;
        }

        protected void DrawSelector(Rect position, SerializedProperty property)
        {
            AnimationType animationType = (AnimationType)GetProperty(PropertyName.AnimationType, property).enumValueIndex;
         //   EditorGUILayout.PropertyField(m_animationType, new GUIContent("AnimationType"));
            //Debug.Log("DrawSelector " + animationType);
            switch (animationType)
            {
                case AnimationType.Show:
                    DrawShow(position, property);
                    break;
                case AnimationType.Hide:
                    DrawHide(position, property);
                    break;
                case AnimationType.Loop:
                    DrawLoop(position, property);
                    break;
                case AnimationType.Punch:
                    DrawPunch(position, property);
                    break;
                case AnimationType.State:
                    DrawState(position, property);
                    break;
                case AnimationType.Undefined:
                    DrawUndefined(position, property);
                    break;
                default: throw new ArgumentOutOfRangeException();
            }
        }

        protected virtual void DrawShow(Rect position, SerializedProperty property) { }
        protected virtual void DrawHide(Rect position, SerializedProperty property) { }
        protected virtual void DrawLoop(Rect position, SerializedProperty property) { }
        protected virtual void DrawPunch(Rect position, SerializedProperty property) { }
        protected virtual void DrawState(Rect position, SerializedProperty property) { }
        protected virtual void DrawUndefined(Rect position, SerializedProperty property) { }

        protected void DrawLineStartDelayDurationCustomFromAndTo(SerializedProperty property)
        {  
            DrawProperty(PropertyName.StartDelay, property, "StartDelay");
            DrawProperty(PropertyName.Duration, property, "Duration");
            DrawProperty(PropertyName.UseCustomFromAndTo, property, "UseCustomFromAndTo");
 
        }

        protected void DrawLineStartDelayAndDuration(SerializedProperty property)
        {
            DrawProperty(PropertyName.StartDelay, property, "StartDelay");
            DrawProperty(PropertyName.Duration, property, "Duration");
            
        }

        protected void DrawLineEaseTypeEaseAnimationCurve(SerializedProperty property)
        {
            //Debug.Log("DrawLineEaseTypeEaseAnimationCurve");
            DrawProperty(PropertyName.Ease, property, "Ease");
        }

        protected void DrawLineEaseTypeEaseAnimationCurveRotateMode(SerializedProperty property)
        {
            DrawProperty(PropertyName.Ease, property, "Ease");
            DrawProperty(PropertyName.RotateMode, property, "RotateMode");
        }

        protected SerializedProperty DrawProperty(PropertyName propertyName, SerializedProperty parentProperty, string label)
        {
            SerializedProperty childProp = GetProperty(propertyName, parentProperty);

            EditorGUILayout.PropertyField(childProp, new GUIContent(label));

            return childProp;
        }
    }
}