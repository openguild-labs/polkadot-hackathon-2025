


using UnityEditor;
using UnityEngine;
using Imba.UI;
using Imba.UI.Animation;

namespace Imba.Editor.UI
{
    [CustomPropertyDrawer(typeof(TweenMove), true)]
    public class MoveDrawer : BaseAnimationDrawer
    {
       

        private void Init(SerializedProperty property)
        {
           
        }

        public override void OnGUI(Rect position, SerializedProperty property, GUIContent label)
        {
            base.OnGUI(position, property, label);
            Init(property);

            // Using BeginProperty / EndProperty on the parent property means that
            // prefab override logic works on the entire property.
            EditorGUI.BeginProperty(position, label, property);
            {
                // don't make child fields be indented
                int indent = EditorGUI.indentLevel;
                EditorGUI.indentLevel = 3;
    
                DrawSelector(position, property);

                // set indent back to what it was
                EditorGUI.indentLevel = indent;


                property.serializedObject.ApplyModifiedProperties();
            }
            EditorGUI.EndProperty();
        }


        protected override void DrawShow(Rect position, SerializedProperty property)
        {
           
            DrawLineStartDelayDurationCustomFromAndTo(property);
            
            SerializedProperty UseCustomFromAndTo = GetProperty(PropertyName.UseCustomFromAndTo, property);

            SerializedProperty Direction = DrawProperty(PropertyName.Direction, property, "Direction"); ;
            if (UseCustomFromAndTo.boolValue)
            {
                DrawProperty(PropertyName.From, property, "From");
                DrawProperty(PropertyName.To, property, "To");      
            }
            else if ((Direction) Direction.enumValueIndex == Imba.UI.Animation.Direction.CustomPosition)
            {
               // DrawProperty(PropertyName.From, property, "From");
                DrawProperty(PropertyName.CustomPosition, property, "CustomPosition");
            }
            else 
            {
               // DrawProperty(PropertyName.From, property, "From");
            }
            
            
               
           
            DrawLineEaseTypeEaseAnimationCurve(property);
        }

        protected override void DrawHide(Rect position, SerializedProperty property)
        {
           
            DrawLineStartDelayDurationCustomFromAndTo(property);

            SerializedProperty UseCustomFromAndTo = GetProperty(PropertyName.UseCustomFromAndTo, property);

            SerializedProperty Direction;
            if (UseCustomFromAndTo.boolValue)
            {
                DrawProperty(PropertyName.To, property, "To");   
                DrawProperty(PropertyName.From, property, "From");                   
                Direction = DrawProperty(PropertyName.Direction, property, "Direction"); 
            }
            else
            {
               // DrawProperty(PropertyName.To, property, "To");
                Direction = DrawProperty(PropertyName.Direction, property, "Direction");
            }
            
            if((Direction)Direction.enumValueIndex == Imba.UI.Animation.Direction.CustomPosition)
                DrawProperty(PropertyName.CustomPosition, property, "CustomPosition");
           
            DrawLineEaseTypeEaseAnimationCurve( property);
        }

        protected override void DrawState(Rect position, SerializedProperty property)
        {
            DrawLineStartDelayAndDuration(property);
            DrawProperty(PropertyName.By, property, "By");
            DrawLineEaseTypeEaseAnimationCurve( property);
        }

        protected override void DrawPunch(Rect position, SerializedProperty property)
        {
            DrawProperty(PropertyName.StartDelay, property, "StartDelay");
            DrawProperty(PropertyName.Duration, property, "Duration");
            DrawProperty(PropertyName.Vibrato, property, "Vibrato");
            DrawProperty(PropertyName.Elasticity, property, "Elasticity");
            DrawProperty(PropertyName.By, property, "By");
        }

        protected override void DrawLoop(Rect position, SerializedProperty property)
        {
            DrawProperty(PropertyName.StartDelay, property, "StartDelay");
            DrawProperty(PropertyName.Duration, property, "Duration");
            DrawProperty(PropertyName.NumberOfLoops, property, "NumberOfLoops");
            DrawProperty(PropertyName.LoopType, property, "LoopType");
            DrawProperty(PropertyName.By, property, "By");

            DrawLineEaseTypeEaseAnimationCurve(property);
        }

        protected override void DrawUndefined(Rect position, SerializedProperty property)
        {
            DrawProperty(PropertyName.AnimationType, property, "AnimationType");
        }
    }
}