import { useSelector } from "react-redux";

export default function useAuth() {
  const auth = useSelector(store => store.user)
  return auth;
}