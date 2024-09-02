// @ts-ignore
import CloseIcon from '@web/extension-services/inpage/assets/close-icon.svg'
import { isInSameOriginIframe } from '@web/extension-services/inpage/utils/iframe'

interface Options {
  content: string
  closeButton: HTMLElement | string
  container: HTMLElement
  timeout: number
  onHide?: () => void
  className?: string
  closeable: boolean
}
class Notification {
  options: Options

  el: HTMLDivElement | null

  events: Record<string, (...args: any) => void>

  closeButton?: HTMLElement

  timer?: number | null

  constructor(options: Options) {
    this.options = options
    this.el = document.createElement('div')
    this.el.className = `rabby-notice ${this.options.className ? this.options.className : ''}`

    // initial events
    this.events = {}

    // inner element
    this.insert()

    // auto hide animation
    if (this.options.timeout) {
      this.startTimer()
    }

    // mouse events
    this.registerEvents()
  }

  insert() {
    if (!this.el) {
      return
    }

    // main
    const elMain = document.createElement('div')
    elMain.className = 'rabby-notice-content'
    elMain.innerHTML = this.options.content
    this.el?.appendChild(elMain)

    // close button
    if (this.options.closeable) {
      this.closeButton = document.createElement('img')
      this.closeButton.setAttribute('src', CloseIcon)
      this.closeButton.className = 'rabby-notice-close'
      this.el.appendChild(this.closeButton)
    }

    this.options.container.appendChild(this.el)
  }

  registerEvents() {
    this.events.hide = () => this.hide()

    this.closeButton?.addEventListener('click', this.events.hide, false)
  }

  startTimer(timeout = this.options.timeout) {
    this.timer = setTimeout(() => {
      this.hide()
    }, timeout) as unknown as number
  }

  stopTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  hide() {
    if (!this.el) {
      return
    }
    this.el.classList.add('.rabby-notice-is-hide')
    // setTimeout(() => {
    this.options.container.removeChild(this.el!)
    this.el = null
    if (this.options.onHide) {
      this.options.onHide()
    }
    this.stopTimer()
    // }, 300);
  }
}
let container: HTMLDivElement | null = null
let style: HTMLStyleElement | null = null

const styles = `
    .rabby-notice-container {
      position: fixed;
      z-index: 99999;
      top: 60px;
      right: 42px;
      font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Roboto, sans-serif;
    }
    .rabby-notice-container * {
      font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Roboto, sans-serif;
      color: #192945;
    }

    .rabby-notice {
      min-width: 230px;
      min-height: 44px;
      background: #FFFFFF;
      border: 1px solid #7084FF;
      border: 1.5px solid #7084FF;
      box-sizing: border-box;
      box-shadow: 0px 24px 40px rgba(134, 151, 255, 0.12);
      border-radius: 8px;
      display: flex;
      align-items: center;

      font-family: 'Arial', sans-serif;
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
      color: #192945;

      padding: 12px;
      gap: 8px;

      opacity: 1;
    }
    .rabby-notice + .rabby-notice {
      margin-top: 30px;
    }
    .rabby-notice-content {
      display: flex;
      align-items: center;
      color: #192945;
    }
    .rabby-notice-is-hide {
      opacity: 0;
      transition: 0.3s;
    }

    .rabby-notice-icon {
      width: 20px;
    }
    .rabby-notice-close {
      flex-shrink: 0;
      margin-left: 16px;
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    .rabby-strong {
      font-weight: bold;
      color: #192945;
    }
    .rabby-notice-default-wallet {
      border-radius: 12px;
      height: 64px;
      padding-left: 16px;
      padding-right: 20px;

      font-size: 12px;
      line-height: 16px;

      color: #192945;
    }
  `

function notification(options: Partial<Options>) {
  const {
    content = '',
    timeout = 5000,
    closeButton = '×',
    className = '',
    closeable = false
  } = options || {}

  if (!container) {
    container = document.createElement('div')
    container.classList.add('rabby-notice-container')
    style = document.createElement('style')
    style.innerHTML = styles
    document.body.appendChild(style)
    document.body.appendChild(container)
  }

  return new Notification({
    content,
    timeout,
    closeButton,
    container,
    className,
    closeable,
    onHide: () => {
      if (container && !container?.hasChildNodes()) {
        document.body.removeChild(container)
        style && document.body.removeChild(style)
        style = null
        container = null
      }
    }
  })
}

export default notification

let instance: ReturnType<typeof notification> | null

export type CreateNotificationType = {
  title: string
  description: string
  timeout?: number
}

export const createNotification = ({ title, description, timeout }: CreateNotificationType) => {
  if (isInSameOriginIframe()) {
    return
  }
  if (instance) {
    instance.hide()
    instance = null
  }

  const AmbireLogo =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudCIgeTE9IjEiIHgyPSIxIiBncmFkaWVudFVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzM1MDA4YyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjAuMTk0IiBzdG9wLWNvbG9yPSIjNjAwMGZmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMC41ODYiIHN0b3AtY29sb3I9IiM5MDRkZmYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYjE0MGVjIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQtMiIgeDE9IjAuNjgyIiB5MT0iMC4xNDIiIHgyPSIwLjQ4NSIgeTI9IjAuOTg2IiBncmFkaWVudFVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2JiYmRiZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjAuMzg2IiBzdG9wLWNvbG9yPSIjZGRkZWRmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPGcgaWQ9InhpY29uX2Nvbm5lY3RlZF85NnB4IiBkYXRhLW5hbWU9InhpY29uX2Nvbm5lY3RlZCA5NnB4IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjY3NyAtMTAxMykiPgogICAgPHBhdGggaWQ9IlBhdGhfOTcwNyIgZGF0YS1uYW1lPSJQYXRoIDk3MDciIGQ9Ik0yNywwSDY5QTI3LDI3LDAsMCwxLDk2LDI3VjY5QTI3LDI3LDAsMCwxLDY5LDk2SDI3QTI3LDI3LDAsMCwxLDAsNjlWMjdBMjcsMjcsMCwwLDEsMjcsMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI2NzcgMTAxMykiIGZpbGw9InVybCgjbGluZWFyLWdyYWRpZW50KSIvPgogICAgPGcgaWQ9IkxheWVyX3gwMDIwXzEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI2OTcuNDEgMTAxOS40NTYpIj4KICAgICAgPGcgaWQ9Il8yMTcxMzQ3OTYzNDI0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDApIj4KICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMDAyIiBkYXRhLW5hbWU9IlBhdGggMzAwMiIgZD0iTTgzMC40NzcsMjYxOS4zMjZsLTUuMjExLDE0Ljc4NmEuNjQ4LjY0OCwwLDAsMCwuMDMzLjUxbDQuODY3LDkuNTYxLTEzLjM3NSw3LjU3OGEuMzI0LjMyNCwwLDAsMS0uNDU0LS4xNDFsLTIuODkyLTYuMDIzYS42NDUuNjQ1LDAsMCwxLC4wNDItLjYzNmwxNi44NzQtMjUuNjkzQS4wNjUuMDY1LDAsMCwxLDgzMC40NzcsMjYxOS4zMjZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODExLjYgLTI2MDcuMjcxKSIgZmlsbD0iI2Q2ZDdkOCIvPgogICAgICAgIDxwYXRoIGlkPSJQYXRoXzMwMDMiIGRhdGEtbmFtZT0iUGF0aCAzMDAzIiBkPSJNNTE5OS4zMzksNjE1Mi4wODNsMTEuMDgsMjMuNmEuNjU2LjY1NiwwLDAsMS0uMTQxLjc0NmwtMjkuMTI3LDI4LjEyOWEuMzI0LjMyNCwwLDAsMS0uNTUxLS4yMzR2LTI1Ljg2M2wxOC4zNjMtMTcuNzI3YS42Mi42MiwwLDAsMCwuMi0uNDYxbC4wNTMtOC4xNjRBLjA2NS4wNjUsMCwwLDEsNTE5OS4zMzksNjE1Mi4wODNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTE1NC4yNzQgLTYxMjAuMjI0KSIgZmlsbD0iI2Q2ZDdkOCIvPgogICAgICAgIDxwYXRoIGlkPSJQYXRoXzMwMDQiIGRhdGEtbmFtZT0iUGF0aCAzMDA0IiBkPSJNOTg3Ljc1NCw3MDU2LjkzMmwtMTUuODk0LDMuMTM3LDIuMDY1LDQuM2EuMzI2LjMyNiwwLDAsMCwuNDU0LjE0MWgwbDEzLjM3NS03LjU3NFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05NjkuMTg5IC03MDIwLjAyMSkiIGZpbGw9IiNjM2MzYzMiLz4KICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMDA1IiBkYXRhLW5hbWU9IlBhdGggMzAwNSIgZD0iTTgzMC45MjcsMjYzNC4yNjgsODE5LjExLDI2NDUuMWEuNjcuNjcsMCwwLDEsLjA3NC0uMTUzbDE2Ljg3NC0yNS42OTNoMGEuMDY0LjA2NCwwLDAsMSwuMDU0LS4wMjloMGEuMDY1LjA2NSwwLDAsMSwuMDYzLjA4OGwtNS4yMTIsMTQuNzg2aDBBLjY1NS42NTUsMCwwLDAsODMwLjkyNywyNjM0LjI2OFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MTcuMjk4IC0yNjA3LjI1NSkiIGZpbGw9IiNmZmYiLz4KICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMDA2IiBkYXRhLW5hbWU9IlBhdGggMzAwNiIgZD0iTTUxOTEuMjkxLDkwMjguNDJsLTEwLjYyMSwyNC44NDRWOTAzOC42N1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01MTU0LjM0NCAtODk4MC40MzIpIiBmaWxsPSIjYzNjM2MzIi8+CiAgICAgICAgPHBhdGggaWQ9IlBhdGhfMzAwNyIgZGF0YS1uYW1lPSJQYXRoIDMwMDciIGQ9Ik04NDc4LjE3Miw2MTc2LjE1NmwtMTEuMzkxLTE1LjQ3N2EuNjQxLjY0MSwwLDAsMCwuMDk0LS4zMjhsLjA0Ny04LjE3MmgwYS4wNjYuMDY2LDAsMCwxLC4wNy0uMDYyaDBhLjA2Mi4wNjIsMCwwLDEsLjA1OS4wMzlsMTEuMDc0LDIzLjZoMEEuNTc5LjU3OSwwLDAsMSw4NDc4LjE3Miw2MTc2LjE1NloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04NDIxLjk4IC02MTIwLjI5NSkiIGZpbGw9IiNmZmYiLz4KICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMDA4IiBkYXRhLW5hbWU9IlBhdGggMzAwOCIgZD0iTTUyMy4yNTQsNDkwLjQzNmwxMi4zLDMwLjEzYS42NDYuNjQ2LDAsMCwxLDAsLjVsLTE5Ljg2OCw0Ni40ODJhLjMyNi4zMjYsMCwwLDEtLjUyNi4xMDZMNDk2Ljg4MSw1NTBhLjY1LjY1LDAsMCwxLS4wNzItLjg1M2wyNi4wNjctMzUuMzEzYS42NTMuNjUzLDAsMCwwLC4xMjctLjM4NlY0OTAuNDg1QS4xMy4xMywwLDAsMSw1MjMuMjU0LDQ5MC40MzZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDk2LjY4MyAtNDkwLjM1NCkiIGZpbGw9InVybCgjbGluZWFyLWdyYWRpZW50LTIpIi8+CiAgICAgICAgPHBhdGggaWQ9IlBhdGhfMzAwOSIgZGF0YS1uYW1lPSJQYXRoIDMwMDkiIGQ9Ik01MTc0LjIzLDUxMy42NThsMTIuNjI3LDcuMTM5YS42LjYsMCwwLDAtLjA0Ny0uMjE3aDBsLTEyLjMtMzAuMTI5YS4xMjIuMTIyLDAsMCwwLS4xMTktLjA4MmgwYS4xMjcuMTI3LDAsMCwwLS4xMjkuMTNoMHYyMi45NjRBLjcxMy43MTMsMCwwLDEsNTE3NC4yMyw1MTMuNjU4WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTUxNDcuOTM5IC00OTAuMzY5KSIgZmlsbD0iI2ZmZiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K'

  const rawContent = `
    <img style="width: 96px; height: 96px; margin-right: 8px;" src="${AmbireLogo}" alt="ambire-logo" />
    <div style="color: #192945; padding-right: 2px;">
      ${title}
    <div>
    <div style="color: #192945; padding-right: 2px;">
      ${description}
    <div>
  `
  const content = rawContent

  instance = notification({ timeout: timeout || 333333333, content })
}
