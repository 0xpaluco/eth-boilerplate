import { classNames } from "@src/helpers";
import Link from "next/link";

const tabxs = [
  { name: "Collections Created", href: "/profile", current: true },
  { name: "Nfts Owned", href: "/profile/nfts", current: false },
  { name: "Communities Joined", href: "#", current: false },
];

export interface Tab {
    name: string
    href: string
    value: number
    current: boolean
}
interface TabsProps {
    tabs: Tab[]
}
export default function ProfileTabs({ tabs }: TabsProps) {
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue={tabs.find((tab) => tab.current)?.name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav
            className="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-y-0 sm:divide-x"
            aria-label="Tabs"
          >
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={classNames(
                  tab.current
                    ? "border-indigo-500 text-gray-600 bg-gray-100"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-100",
                  "px-6 py-5 text-center text-sm font-medium"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                <span className="text-gray-900">{tab.value}</span>{" "}
                <span>{tab.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
