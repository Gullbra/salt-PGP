import { useRef } from "react"
import axios from 'axios'

function NewUserForm(/*{onSubmit}*/) {
  const email_input = useRef(null)
  const password_input = useRef(null)
  const confirmed_password_input = useRef(null)
  const type_input = useRef(null)

  return (
      <>
        <h3>Create new user</h3>
        <form 
          onSubmit={event => {
            event.preventDefault()

            //const newUser = {}
            if (
              email_input.current?.value &&
              password_input.current?.value &&
              confirmed_password_input.current?.value &&
              type_input.current?.value
            ) {
              if (password_input.current.value !== confirmed_password_input.current.value) window.alert("Passwords don't match! Idiot!")
              
              console.log("Am I here?")
              axios.post("http://localhost:8000/api/user", {
                email: email_input.current.value,
                password: password_input.current.value,
                role: type_input.current.value
              })
                .then(res => console.log(res))
                .catch(err => console.log(err.message))
                .finally(()=> console.log("📮 axios called"))
              console.log("end of func")
            }

            // TODO: new FormData(event.currentTarget)

            console.log(
              "click", 
              email_input.current.value,
              password_input.current.value,
              confirmed_password_input.current.value,
              type_input.current.value
            )


          }} 
          className={"create_user_form"}
        >
          <label htmlFor="email_input">Email</label>
          <input placeholder={"email"} id={"email_input"} ref={email_input}/>
          <br/>

          <label htmlFor="password_input">Password</label>
          <input placeholder={"password"} id={"password_input"} ref={password_input}/>
          <br/>

          <label htmlFor="confirmed_password_input">Confirm password</label>
          <input placeholder={"confirm password"} id={"confirmed_password_input"} ref={confirmed_password_input}/>
          <br/>

          <label htmlFor="type_input">Type of User</label>
          <select placeholder={"user"} id={"type_input"} ref={type_input}>
            <option value={"user"}>User</option>
            <option value={"admin"}>Admin</option>
          </select>
          <br/>

          <input type={'submit'}/>
        </form>
      </>
  )
}

export default NewUserForm;