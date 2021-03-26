import { useState, useEffect } from 'react';
import { DEFAULT_REQUIRED_ERROR_TEXT } from './const';

const useField = (options) => {
  const {
    isDirty,
    isSubmitted,
    name,
    value,
    changeValues,
    changeInvalidFields,
    required = false,
    requiredErrorText = DEFAULT_REQUIRED_ERROR_TEXT,
    formatter = null,
    validate = null,
    afterDot,
  } = options;

  const [isTouched, setIsTouched] = useState(false);
  const [focus, setFocus] = useState(false);
  const [error, setError] = useState('');

  // sets value to form state
  // works only with inputs with 'text' type or by using manually
  const onChange = suspense => {
    let value;

    if (
      suspense &&
      typeof suspense === 'object' &&
      suspense.preventDefault &&
      suspense.target
    ) {
      suspense.preventDefault();
      value = suspense.target.value;
    } else {
      value = suspense;
    }

    changeValues({ [name]: formatter ? formatter(value, afterDot) : value });
  };

  // sets focus as true to field state
  const onFocus = () => {
    setFocus(true);
    if (!isTouched) setIsTouched(true);
  };

  // sets focus as false to field state
  // sets isTouched as true to field state
  const onBlur = () => {
    setFocus(false);

    if (!isTouched) {
      setIsTouched(true);
    }
  };

  // sets error to field state
  useEffect(() => {
    let error = '';

    if (!value && required) {
      error = requiredErrorText;
    } else if (
      (value || value === '' || isTouched || value === 0) &&
      validate
    ) {
      error = validate(value);
    }

    setError(error);
  }, [value, required, validate]);

  // sets field validation result to form state
  useEffect(() => {
    changeInvalidFields(name, !error);
  }, [!error]);

  // sets isTouched as true if form has been submitted
  useEffect(() => {
    if (isSubmitted && !isTouched) {
      setIsTouched(true);
    }
  }, [isSubmitted]);

  return {
    input: {
      value,
      onFocus,
      onBlur,
      onChange,
    },
    meta: {
      isDirty,
      isTouched,
      focus,
      error,
    },
  };
}

export default useField;
