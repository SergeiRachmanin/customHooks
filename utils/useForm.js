import { useState, useEffect } from 'react';
import _isEqual from 'lodash/isEqual';

const useForm = (options = {}) => {
  const { initialValues = {}, outputFormatter, onChange, enable = false } = options;

  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [defaultValues, setDefaultValues] = useState(initialValues);
  const [values, setValues] = useState(initialValues);
  const [invalidFields, setInvalidFields] = useState([]);

  // sets new values to form state
  const changeValues = newValues => {
    setValues(values => ({ ...values, ...newValues }));
  };

  // sets new invalid fields to form state
  // removes valid fields from form state
  const changeInvalidFields = (fieldName, isValid) => {
    setInvalidFields(invalidFields => {
      if (isValid) {
        const current = [...invalidFields];
        current.splice(current.indexOf(fieldName), 1);
        return current;
      }

      return [...invalidFields, fieldName];
    });
  };

  // handles submit event
  // set isSubmitted as true to form state
  // calls callback if form has no invalid fields
  const handleSubmit = callback => e => {
    if (e) {
      e.preventDefault();
    }

    if (!isSubmitted) {
      setIsSubmitted(true);
    }

    if (callback && !invalidFields.length) {
      callback(outputFormatter ? outputFormatter(values) : values);
    }
  };

  // sets new default values into form state
  // sets isSubmitted as false into form state
  const reset = (newInitialValues = {}) => {
    setDefaultValues(newInitialValues);
    setIsSubmitted(false);
  };

  // returns actual props for any field by field name
  const getFieldProps = name => {
    const value = values[name];
    const isDirty = values[name] !== defaultValues[name];

    return {
      isDirty,
      isSubmitted,
      name,
      value,
      changeInvalidFields,
      changeValues,
    };
  };

  // sets new values to form state if default values have been changed
  useEffect(() => {
    setValues(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    if (enable) {
      setDefaultValues(initialValues)
      setIsDirty(false)
    }
  }, [initialValues, enable])

  // handles values changing
  // set isDirty as true to form state if values are not equal to default values
  // set isDirty as false to form state if values are equal to default values
  // calls onChange with values or formatted values if onChange has been passed
  useEffect(() => {
    setIsDirty(!_isEqual(values, defaultValues));

    if (onChange) {
      onChange(outputFormatter ? outputFormatter(values) : values);
    }
  }, [values]);

  return {
    changeValues,
    getFieldProps,
    handleSubmit,
    reset,
    formState: {
      isDirty,
      isSubmitted,
      values,
      isValid: !invalidFields.length,
    },
  };
}

export default useForm;
