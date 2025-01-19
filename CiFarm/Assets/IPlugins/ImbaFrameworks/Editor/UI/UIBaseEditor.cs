// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08

using System;
using System.Collections.Generic;
using UnityEditor;
using UnityEditor.AnimatedValues;
using UnityEngine;

using Imba.UI;

namespace Imba.Editor.UI
{
    public class UIBaseEditor :  UnityEditor.Editor
    {
        
        public static readonly Dictionary<string, SerializedProperty> SerializedProperties = new Dictionary<string, SerializedProperty>();

        #region Unity Methods

        /// <summary> Called when object becomes enabled and active </summary>
        protected virtual void OnEnable()
        {
            LoadSerializedProperty();
        }
        
        #endregion

        #region Public Methods
        
        protected SerializedProperty GetProperty(PropertyName propertyName) { return GetProperty(propertyName.ToString()); }
        protected SerializedProperty GetProperty(PropertyName propertyName, SerializedProperty parentProperty) { return GetProperty(propertyName.ToString(), parentProperty); }

        protected SerializedProperty GetProperty(string propertyName)
        {
            if (serializedObject == null) return null;
            
           // Debug.Log("GetProperty" + propertyName);
            string key = propertyName;
            //if (SerializedProperties.ContainsKey(key)) return SerializedProperties[key];
            SerializedProperty s = serializedObject.FindProperty(propertyName);
            if (s == null)
            {
                Debug.LogError("Not found property " + propertyName);
                return null;
            }
            //SerializedProperties.Add(key, s);
          //  Debug.Log("got property " + propertyName);
            return s;
        }

        protected SerializedProperty GetProperty(string propertyName, SerializedProperty parentProperty)
        {
            string key = parentProperty.propertyPath + "." + propertyName;
            //if (SerializedProperties.ContainsKey(key)) return SerializedProperties[key];
            SerializedProperty s = parentProperty.FindPropertyRelative(propertyName);
            if (s == null)
            {
                Debug.LogError("Not found property " + propertyName);
                return null;
            }
            //SerializedProperties.Add(key, s);
            return s;
        }
        
        /// <summary> Loads defined SerializedProperties OnEnable </summary>
        protected virtual void LoadSerializedProperty() { }
        
        #endregion
    }
}