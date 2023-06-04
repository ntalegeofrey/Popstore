import AppTooltip from "../AppTooltip"
import { useState } from "react"

const DashboardTooltipComponent = () => {
    const titles = ['Hello', 'This is a tooltip', 'Dashboard']
    const [activeTitle, setActiveTitle] = useState({ index: 1, title: titles[0] })

    return (<>
        <div>
            <button>Back</button>
            <button>Skip</button>
        </div>
        <div>{activeTitle}<span>{`${activeTitle.index}/${titles.length}`}</span></div>
        <div>Next</div>
    </>)
}

const DashboardTooltip = ({ title, children }) => {
    return (<AppTooltip
        title={
            <React.Fragment>
                <DashboardTooltipComponent />
            </React.Fragment>
        }
    >
        {children}
    </AppTooltip>)
}


export default DashboardTooltip 