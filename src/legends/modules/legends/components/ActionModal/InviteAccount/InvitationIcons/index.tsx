import React from 'react'

const AcceptedIcon = () => (
  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8.49951" r="8" fill="#62804D" />
    <path
      d="M5 8.85053L7.43243 11.2995L12.2 6.49951"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

const ExpiredIcon = () => (
  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8.49951" r="8" fill="#991E1E" />
    <path d="M5 11.4995L10.76 5.49951" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M11 11.4995L5.24 5.49951" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const PendingIcon = () => (
  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8.49951" r="8" fill="#B38824" />
    <path
      d="M10.9686 11.0483L8.48859 9.57135C8.26016 9.41849 8.07042 9.2146 7.93435 8.97579C7.79828 8.73698 7.71962 8.4698 7.70459 8.19535V4.90674"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default ({ status }: { status: string }) => {
  if (status === 'pending') return <PendingIcon />
  if (status === 'accepted') return <AcceptedIcon />
  if (status === 'expired') return <ExpiredIcon />
  return <div />
}
