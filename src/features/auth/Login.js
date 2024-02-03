import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useLoginMutation } from './authApiSlice'
import { useEffect, useRef, useState } from 'react'
import { setCredentials } from './authSlice'
import usePersist from '../../hooks/usePersist'
import useTitle from "../../hooks/useTitle"

const Login = () => {
  useTitle("Login")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [login , {isLoading}] = useLoginMutation()
  
  const userRef = useRef()
  const errRef = useRef()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [persist, setPersist] = usePersist()

  useEffect(()=>{
    userRef.current.focus()
  }, [])

  useEffect(()=>{
    setErrMsg('')
  },[username, password])

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      const { accessToken } = await login({ username, password }).unwrap()
      dispatch(setCredentials({accessToken}))
      setUsername('')
      setPassword('')
      navigate('/dash')
    } catch (err) {
      if (!err.status) {
        console.log(err)
          setErrMsg('No Server Response');
      } else if (err.status === 400) {
          setErrMsg('Missing Username or Password');
      } else if (err.status === 401) {
          setErrMsg('Unauthorized');
      } else {
          setErrMsg(err.data?.message);
      }
      
      if(errMsg){
        errRef.current.focus()
      }
     
      
    }
  }

  const handleUserInput = e => setUsername(e.target.value)
  const handlePasswordInput = e => setPassword(e.target.value)
  const handleToggle = () => setPersist(prev => !prev)

  const errClass = errMsg ? "errmsg" : "offscreen"
  if(isLoading) return <p>Loading...</p>
  const content = (
    <section className="public">
            <header>
                <h1>Employee Login</h1>
            </header>
            <main className="login">
              <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        className="form__input"
                        type="text"
                        id="username"
                        ref={userRef}
                        value={username}
                        onChange={handleUserInput}
                        autoComplete="off"
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        className="form__input"
                        type="password"
                        id="password"
                        onChange={handlePasswordInput}
                        value={password}
                        required
                    />
                    <button className="form__submit-button">Sign In</button>

                    <label htmlFor="persist" className="form__persist">
                        <input
                            type="checkbox"
                            className="form__checkbox"
                            id="persist"
                            onChange={handleToggle}
                            checked={persist}
                        />
                        Trust This Device
                    </label>
                </form>
            </main>
            <footer>
                <Link to="/">Back to Home</Link>
            </footer>
        </section>
  )
  return content
}

export default Login