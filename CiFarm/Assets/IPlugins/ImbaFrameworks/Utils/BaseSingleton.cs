//========================================================
// class BaseSingleton
//========================================================
// - for making singleton object
// - usage
//		+ declare class(derived )	
//			public class OnlyOne : BaseSingleton< OnlyOne >
//		+ client
//			OnlyOne.Instance.[method]
//========================================================

using UnityEngine;

namespace Imba.Utils
{

    public abstract class Singleton<T> where T : new()
    {
        private static T _instance;

        public static T Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new T();
                }
                return _instance;
            }
        }
    }

    /// <summary>
    /// Singleton for mono behavior object, only return exsited object, don't create new
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class ManualSingletonMono<T> : MonoBehaviour where T : MonoBehaviour
    {
        private static T _instance;

        private static bool _applicationIsQuitting;

        public static T Instance
        {
            get
            {
                if (_applicationIsQuitting)
                    return null;

                if (_instance == null)
                {
                    Debug.LogError("Cannot find Object with type " + typeof(T));
                }

                return _instance;
            }
        }

        public static bool IsInstanceValid()
        {
            if (_applicationIsQuitting)
                return false;

            return (_instance != null);
        }

        //MUST OVERRIDE AWAKE AT CHILD CLASS
        public virtual void Awake()
        {
            if (_instance != null)
            {
                Debug.LogWarning("Already has intsance of " + typeof(T));
                GameObject.Destroy(this);
                return;
            }

            if (_instance == null)
                _instance = (T)(MonoBehaviour)this;

            if (_instance == null)
            {
                Debug.LogError("Awake xong van NULL " + typeof(T));
            }
            //Debug.LogError("Awake of " + typeof(T));
        }

        protected virtual void OnDestroy()
        {
            //self destroy?
            if (_instance == this)
            {
                _instance = null;
                //Debug.LogError ("OnDestroy " + typeof(T));
            }
        }


        private void OnApplicationQuit()
        {
            _applicationIsQuitting = true;
        }
    }

    public class AutoSingletonMono<T> : MonoBehaviour where T : MonoBehaviour
    {
        private static T _instance;

        private static bool _applicationIsQuitting;

        public static T Instance
        {
            get
            {
                if (_applicationIsQuitting)
                    return null;

                if (_instance == null)
                {
                    // Need to create a new GameObject to attach the singleton to.
                    var singletonObject = new GameObject();
                    _instance = singletonObject.AddComponent<T>();
                    singletonObject.name = typeof(T).ToString() + " (Singleton)";

                }

                return _instance;
            }
        }

        public static bool IsInstanceValid()
        {
            return (_instance != null);
        }

        //MUST OVERRIDE AWAKE AT CHILD CLASS
        public virtual void Awake()
        {
            if (_instance != null)
            {
                Debug.LogWarning("Already has intsance of " + typeof(T));
                GameObject.Destroy(this);
                return;
            }

            if (_instance == null)
                _instance = (T)(MonoBehaviour)this;

            if (_instance == null)
            {
                Debug.LogError("Awake xong van NULL " + typeof(T));
            }
            //Debug.LogError("Awake of " + typeof(T));
        }

        protected virtual void OnDestroy()
        {
            //self destroy?
            if (_instance == this)
            {
                _instance = null;
                //Debug.LogError ("OnDestroy " + typeof(T));
            }
        }


        private void OnApplicationQuit()
        {
            _applicationIsQuitting = true;
        }
    }

}