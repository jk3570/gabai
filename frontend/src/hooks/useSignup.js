import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { BaseURL } from '../BaseURL'

export const useSignup = () => {
  const [error, setError] = useState(null)
  // const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const signup = async (
    role,
    username,
    firstname,
    lastname,
    gender,
    birthdate,
    region,
    province,
    city,
    barangay,
    email,
    password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch(`${BaseURL}/user/signup`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ 
        role,
        username,
        firstname,
        lastname,
        gender,
        birthdate,
        region,
        province,
        city,
        barangay,
        email,
        password})
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json))

      // update the auth context
      dispatch({type: 'LOGIN', payload: json})

      // update loading state
      setIsLoading(false)
      // setMessage('Verification has been sent to your email address.')
    }
  }

  return { signup, isLoading, error }
}