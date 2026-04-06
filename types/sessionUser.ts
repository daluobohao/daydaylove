/** 与 `/api/user/sign-in` 写入 `__user` Cookie 的对象一致 */
export type SessionUser = {
  userId?: string
  email?: string
  token?: string
}
