import { injectable } from 'inversify'

const GOVERNANCE_REVIEW_ADDRESSES = ['0x04c9ba79eff2d8fdedf59b50dcefd6d99d75162c']
const RKH_ADDRESSES = [
  'f1utmsqqeigfrvup3jrhy3gwlffi6aganuh2gu4tq',
  'f1mgy3ayb3joubbtbutyx6c7xhor2xstkvw2srlzq',
  'f1xc3hws5n6y5m3m44gzb3gyjzhups6wzmhe663ji',
  'f12sg5626x5gdstcj6w6ej4uuxxklz2lqlm2nxlra',
  'f1hi63lii743mjv75ulrtgpacxbptdmfwikv6w6hy',
  'f1jg4vwqkmtj4n7siyfkwrr5a7haqtmehkjraof3q',
  'f1k5y3sz5xwm6hx5gckxob6gfkmaf4r76brsl77wi',
  'f1tgenzdgpmvuelvcxryy2py4bb4yucwl45dtsruy',
]

@injectable()
export class RoleService {
  getRole(address: string): string {
    let role = 'USER'
    if (GOVERNANCE_REVIEW_ADDRESSES.includes(address.toLowerCase())) {
      role = 'GOVERNANCE_TEAM'
    } else if (RKH_ADDRESSES.includes(address.toLowerCase())) {
      role = 'ROOT_KEY_HOLDER'
    }

    return role;
  }
}
