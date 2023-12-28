import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

function useThunk(thunk) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRan, setIsRan] = useState(false);
  const dispatch = useDispatch();

  //emptying the error & stop loading immediately
  const reset = () => {
    setLoading(false);
    setError(null);
    setIsRan(false);
  };

  //reseting the is ran state
  const resetIsRan = () => {
    setIsRan(false);
  };

  const runThunk = useCallback(
    async (arg) => {
      try {
        setLoading(true);
        await dispatch(thunk(arg)).unwrap();
        setIsRan(true);
      } catch (err) {
        setError(err.message);
        setIsRan(false);
      } finally {
        setLoading(false);
      }
    },
    [thunk, dispatch]
  );

  return [runThunk, loading, error,reset, isRan, resetIsRan];
}

export { useThunk };
