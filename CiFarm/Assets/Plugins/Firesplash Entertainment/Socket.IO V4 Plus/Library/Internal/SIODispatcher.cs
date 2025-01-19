using UnityEngine;
using System;
using System.Collections;
using System.Collections.Concurrent;

namespace Firesplash.GameDevAssets.SocketIOPlus.Internal
{
	/// <summary>
	/// This behavior holds an action queue and dispatches those actions on the unity player's main thread. It's singleton-like api is accessed through SIODispatcher.Instance
	/// </summary>
	[AddComponentMenu("Networking/Socket.IO/Dispatcher (No need to add this manually, read the docs)")]
	internal class SIODispatcher : MonoBehaviour
	{
		private static SIODispatcher _instance = null;
		private static readonly ConcurrentQueue<Action> dispatchQueue = new ConcurrentQueue<Action>();
		private static readonly ConcurrentQueue<Tuple<int, object>> logQueue = new ConcurrentQueue<Tuple<int, object>>();
		public int maxActionsPerFrame = 30;

		internal void Start()
		{
			StartCoroutine(DispatcherLoop());
		}

		IEnumerator DispatcherLoop()
		{
            while (true)
            {
				//dispatch all pending logs before doing work
				DispatchLogs();
				DispatchActions(maxActionsPerFrame);
                yield return 0;
			}
		}

		internal void DispatchLogs()
		{
            int logEleCount = logQueue.Count; //counting prevents possible deadlocks through excessive addition of elements
            if (logEleCount > 250) logEleCount = 250; //another deadlock prevention
            if (logEleCount > 0)
            {
                for (int i = 0; i < logEleCount; i++)
                {
                    Tuple<int, object> l;
                    if (logQueue.TryDequeue(out l))
                    {

                        switch (l.Item1)
                        {
                            case 0:
                                Debug.Log((string)l.Item2);
                                break;

                            case 1:
                                Debug.LogWarning((string)l.Item2);
                                break;

                            case 2:
                                Debug.LogError((string)l.Item2);
                                break;

                            case 3:
                                Debug.LogException((Exception)l.Item2);
                                break;
                        }
                    }
                    else
                    {
                        //When dequeue is not possible, skip it for this frame
                        break;
                    }
                }
            }
        }

		internal void DispatchActions(int maxCount)
		{
            Action dispatchAction;
            while (dispatchQueue.Count > 0)
            {
                if (dispatchQueue.TryDequeue(out dispatchAction))
                {
                    dispatchAction.Invoke();
                }
                else
                {
                    //not available right now, try again next frame
                    break;
                }

                if (maxCount-- <= 0)
                {
                    break;
                }
            }
        }

		//Enqueues an Action to be run on the main thread
		internal void Enqueue(Action action)
		{
			dispatchQueue.Enqueue(action);
		}

        internal void Log(string message)
        {
            logQueue.Enqueue(new Tuple<int, object>(0, message));
        }

        internal void LogWarning(string message)
        {
			logQueue.Enqueue(new Tuple<int, object>(1, message));
        }

        internal void LogError(string message)
        {
            logQueue.Enqueue(new Tuple<int, object>(2, message));
        }

        internal void LogException(Exception exception)
        {
            logQueue.Enqueue(new Tuple<int, object>(3, exception));
        }

        internal static SIODispatcher Instance
		{
			get
			{
				return _instance;
			}
		}

		internal static void Verify()
		{
			if (_instance == null)
			{
				_instance = new GameObject("Firesplash.UnityAssets.SocketIOPlus.SIODispatcher").AddComponent<SIODispatcher>();
				DontDestroyOnLoad(_instance.gameObject);
			}
		}

		void Awake()
		{
			if (_instance == null)
			{
				_instance = this;
				DontDestroyOnLoad(this.gameObject);
			}
		}

		void OnDestroy()
		{
            //if our queue is not too big, we will dispatch all remaining events
            DispatchLogs();
            DispatchActions(maxActionsPerFrame * 5);

            dispatchQueue.Clear();
			logQueue.Clear();
			_instance = null;
		}

		public static bool CheckAvailability()
		{
			if (SIODispatcher.Instance == null)
			{
				Debug.LogError("Unable to instantiate SIODispatcher. You can try to manually create a GameObject with the SIODispatcher Behaviour in your scene.");
				return false;
			}
			return true;
        }
	}
}