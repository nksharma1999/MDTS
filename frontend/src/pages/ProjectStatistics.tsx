import { useEffect, useState } from "react";
import "../styles/project-timeline.css";
import dayjs from "dayjs";
import { db } from "../Utils/dataStorege.ts";
import { Select, Empty } from "antd";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import '../styles/project-statistic.css';

const { Option } = Select;

const ProjectStatistics = (project: any) => {
    const [dataSource, setDataSource] = useState<any>([]);
    const [selectedModules, setSelectedModules] = useState<string[]>([]);
    const [plannedVsActualData, setPlannedVsActualData] = useState<any[]>([]);
    const [plannedVsDelayData, setPlannedVsDelayData] = useState<any[]>([]);

    useEffect(() => {
        defaultSetup();
    }, []);

    useEffect(() => {
        if (selectedModules.length > 0 && dataSource.length > 0) {
            const selectedActivities = dataSource
                .filter((mod: any) => selectedModules.includes(mod.Code))
                .flatMap((mod: any) => mod.children)
                .filter((activity: any) => activity.plannedStart !== "-" && activity.actualStart);

            const chart1Formatted = selectedActivities.map((activity: any) => ({
                x: dayjs(activity.plannedStart, "DD-MM-YYYY").valueOf(),
                y: dayjs(activity.actualStart, "YYYY-MM-DD").valueOf(),
                activity: activity.keyActivity,
                plannedDate: activity.plannedStart,
                actualDate: dayjs(activity.actualStart).format("DD-MM-YYYY")
            }));

            const chart2Formatted = selectedActivities.map((activity: any) => {
                const planned = dayjs(activity.plannedStart, "DD-MM-YYYY");
                const actual = dayjs(activity.actualStart, "YYYY-MM-DD");
                const delay = actual.diff(planned, 'day'); // Calculate delay in days
                return {
                    x: planned.valueOf(),
                    delay: delay > 0 ? delay : 0,
                    activity: activity.keyActivity,
                    plannedDate: activity.plannedStart,
                    actualDate: dayjs(activity.actualStart).format("DD-MM-YYYY")
                };
            });

            setPlannedVsActualData(chart1Formatted);
            setPlannedVsDelayData(chart2Formatted);
        } else {
            setPlannedVsActualData([]);
            setPlannedVsDelayData([]);
        }
    }, [selectedModules, dataSource]);

    const getProjectTimeline = async (project: any) => {
        if (Array.isArray(project?.projectTimeline)) {
            try {
                const latestVersionId = localStorage.getItem("latestProjectVersion");
                const foundTimeline = project?.projectTimeline.filter((item: any) => item.version == latestVersionId);
                const timelineId = !latestVersionId ? project.projectTimeline[0].timelineId : foundTimeline[0].timelineId;
                const timeline = await db.getProjectTimelineById(timelineId);
                const finTimeline = timeline.map(({ id, ...rest }: any) => rest);
                return finTimeline;
            } catch (err) {
                console.error("Error fetching timeline:", err);
                return [];
            }
        }

        if (Array.isArray(project?.initialStatus?.items)) {
            return project.initialStatus.items.filter(
                (item: any) => item?.status?.toLowerCase() !== "completed"
            );
        }

        return [];
    };

    const defaultSetup = async () => {
        try {
            const storedData: any = (await db.getProjects()).filter((p) => p.id == project.code);
            const selectedProject = storedData[0];
            if (selectedProject?.projectTimeline) {
                const timelineData = await getProjectTimeline(selectedProject);
                handleLibraryChange(timelineData);
            }
        } catch (error) {
            console.error("An unexpected error occurred while fetching projects:", error);
        }
    };

    const handleLibraryChange = (libraryItems: any) => {
        if (libraryItems) {
            const finDataSource = libraryItems.map((module: any, moduleIndex: number) => {
                const children = (module.activities || []).map((activity: any, actIndex: number) => ({
                    key: `activity-${moduleIndex}-${actIndex}`,
                    SrNo: module.parentModuleCode,
                    Code: activity.code,
                    keyActivity: activity.activityName,
                    plannedStart: activity.start ? dayjs(activity.start).format("DD-MM-YYYY") : "-",
                    plannedFinish: activity.end ? dayjs(activity.end).format("DD-MM-YYYY") : "-",
                    actualStart: activity.actualStart || null,
                    actualFinish: activity.actualFinish || null,
                    isModule: false,
                    activityStatus: activity.activityStatus || "yetToStart",
                    fin_status: activity.fin_status || '',
                }));

                return {
                    key: `module-${moduleIndex}`,
                    SrNo: module.parentModuleCode,
                    Code: module.parentModuleCode,
                    keyActivity: module.moduleName,
                    isModule: true,
                    children,
                };
            });
            setDataSource(finDataSource);
            setSelectedModules(finDataSource.map((mod: any) => mod.Code)); // Default all modules selected
        } else {
            setDataSource([]);
        }
    };

    return (
        <div className="project-statistics">
            <div className="top-heading-stats">
                <p className="main-header">Project Statistics</p>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div className="label">
                        <p>Select Module</p>
                    </div>
                    <div className="select-dropdown">
                        <Select
                            mode="multiple"
                            placeholder="Select Modules"
                            style={{ width: 400 }}
                            value={selectedModules}
                            onChange={(values) => setSelectedModules(values)}
                            allowClear
                        >
                            {dataSource.map((mod: any) => (
                                <Option key={mod.Code} value={mod.Code}>
                                    {mod.keyActivity}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>
            </div>

            <div className="graph-title">
                <p>Planned Start vs Actual Start</p>
            </div>

            {plannedVsActualData.length > 0 ? (
                <ResponsiveContainer width="100%" height={450}>
                    <LineChart data={plannedVsActualData} margin={{ top: 10, right: 30, left: 40, bottom: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="x"
                            type="number"
                            scale="time"
                            domain={["auto", "auto"]}
                            tickFormatter={(tick) => dayjs(tick).format("DD MMM")}
                            label={{
                                value: "Planned Start Date",
                                position: "insideBottom",
                                offset: -40,
                                style: { textAnchor: 'middle' }
                            }}
                        />
                        <YAxis
                            dataKey="y"
                            type="number"
                            scale="time"
                            domain={["auto", "auto"]}
                            tickFormatter={(tick) => dayjs(tick).format("DD MMM")}
                            label={{
                                value: "Actual Start Date",
                                angle: -90,
                                position: "insideLeft",
                                offset: -10,
                                style: { textAnchor: 'middle' }
                            }}
                        />
                        <Tooltip
                            formatter={(value: number) => dayjs(value).format("DD-MM-YYYY")}
                            labelFormatter={(label: number) => `Planned: ${dayjs(label).format("DD-MM-YYYY")}`}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Line
                            type="monotone"
                            dataKey="y"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.3}
                            name="Actual Start"
                            dot={{ r: 5 }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <Empty description="No data available. Select a module." />
            )}

            {/* Graph 2 */}
            <div className="graph-title" style={{ marginTop: '60px' }}>
                <p>Planned Date vs Delay (Days)</p>
            </div>

            {plannedVsDelayData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={plannedVsDelayData} margin={{ top: 10, right: 30, left: 40, bottom: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="x"
                            type="number"
                            scale="time"
                            domain={["auto", "auto"]}
                            tickFormatter={(tick) => dayjs(tick).format("DD MMM")}
                            label={{
                                value: "Planned Start Date",
                                position: "insideBottom",
                                offset: -40,
                                style: { textAnchor: 'middle' }
                            }}
                        />
                        <YAxis
                            domain={[0, "auto"]}
                            label={{
                                value: "Delay (Days)",
                                angle: -90,
                                position: "insideLeft",
                                offset: -10,
                                style: { textAnchor: 'middle' }
                            }}
                        />
                        <Tooltip
                            formatter={(value: number) => `${value} days`}
                            labelFormatter={(label: number) => `Planned: ${dayjs(label).format("DD-MM-YYYY")}`}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Line
                            type="monotone"
                            dataKey="delay"
                            stroke="#FF8042"
                            fill="#FF8042"
                            fillOpacity={0.3}
                            name="Delay (days)"
                            dot={{ r: 5 }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <Empty description="No data available. Select a module." />
            )}
        </div>
    );
};

export default ProjectStatistics;