import React, { useState } from 'react'

function RegForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setLoading(false)
  }
  return (
    <div className='reg-form'>
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type='sub mit'>Register</button>
        {error && <p className='error'>{error}</p>}
        {loading && <p className='loading'>Loading...</p>}
      </form>
    </div>
  )
}

export default RegForm