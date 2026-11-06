import { statusClass } from '../utils/helpers'

export default function StatusBadge({ status }) {
  return <span className={`badge ${statusClass(status)}`}>{status}</span>
}
