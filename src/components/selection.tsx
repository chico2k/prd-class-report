import React, { useEffect, useState, useMemo } from "react";
import styled from "@emotion/styled";
import { Sched } from "../types/indes";
import { colors } from "../config/colors";
import { useTranslation } from "react-i18next";
import { useDataStore } from "../store/dataStore";
import { useLabelStore } from "../store/labelStore";
import { usePreferencesStore } from "../store/preferencesStore";

const SidebarContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 300px;
  height: 100vh;
  background-color: ${colors.cardBackground};
  border-right: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const StickyHeader = styled.div`
  padding: 20px;
  background-color: ${colors.cardBackground};
  border-bottom: 1px solid ${colors.border};
  position: sticky;
  top: 0;
  z-index: 10;
`;

const SidebarTitle = styled.h2`
  font-size: 18px;
  color: ${colors.primary};
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${colors.border};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${colors.borderLight};
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s ease-in-out;
  box-sizing: border-box;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  &::placeholder {
    color: ${colors.textLight};
  }
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 10px 10px 10px;
  width: 100%;
  box-sizing: border-box;
`;

const ScheduleItem = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  background-color: ${colors.cardBackground};
  border-radius: 5px;
  border-left: 3px solid ${colors.primary};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: ${colors.primary};
  width: 100%;
  word-wrap: break-word;
`;

const DateInfo = styled.div`
  font-size: 11px;
  color: ${colors.textSecondary};
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
  width: 100%;
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const DateLabel = styled.span`
  font-weight: 600;
  width: 30px;
  margin-right: 4px;
`;

const CourseInfo = styled.div`
  font-size: 11px;
  color: ${colors.textSecondary};
  margin: 0;
  width: 100%;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  margin-right: 4px;
`;

const NoData = styled.div`
  padding: 20px;
  text-align: center;
  color: ${colors.secondary};
`;

const SkeletonPulse = styled.div`
  display: inline-block;
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: pulse 1.5s ease-in-out infinite;
  border-radius: 3px;

  @keyframes pulse {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonScheduleItem = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  border-left: 3px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 90px;
`;

const SkeletonTitle = styled.div`
  height: 14px;
  margin-bottom: 8px;
  width: 80%;
`;

const SkeletonInfo = styled.div`
  height: 12px;
  margin: 5px 0;
  width: 60%;
`;

const SkeletonBadge = styled.div`
  height: 16px;
  width: 30%;
  margin-top: 5px;
`;

const SkeletonDateRow = styled.div`
  height: 12px;
  margin-top: 8px;
  width: 70%;
`;

const EnrollmentCount = styled.div`
  font-size: 11px;
  color: ${colors.textSecondary};
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 4px;
`;

const EnrollmentLabel = styled.span`
  font-weight: 600;
  width: 90px;
  margin-right: 4px;
`;

export const ScheduleSidebar: React.FC<{
  onSelect: (id: number) => void;
  selectedID: number | null;
}> = ({ onSelect, selectedID }) => {
  const { t } = useTranslation();
  const { data, isLoading } = useDataStore();
  const { getSFlabel } = useLabelStore();
  const { getDateTime } = usePreferencesStore();
  const scheduleData = data?.sched;
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Select first schedule by default on mount
  useEffect(() => {
    if (scheduleData && scheduleData.length > 0 && selectedID === null) {
      onSelect(scheduleData[0].SCHD_ID);
    }
  }, [data, selectedID, onSelect, scheduleData]);

  // Create a map of enrollment counts for each schedule
  const scheduleCounts = useMemo(() => {
    const counts: Record<number, number> = {};

    if (data?.enroll) {
      data.enroll.forEach((enrollment) => {
        if (enrollment.SCHD_ID) {
          counts[enrollment.SCHD_ID] = (counts[enrollment.SCHD_ID] || 0) + 1;
        }
      });
    }

    return counts;
  }, [data?.enroll]);

  // Filter schedules based on search query
  const filteredSchedules = scheduleData
    ? scheduleData.filter(
        (schedule) =>
          schedule.CPNT_TITLE.toLowerCase().includes(
            searchQuery.toLowerCase()
          ) ||
          schedule.CPNT_ID.toLowerCase().includes(searchQuery.toLowerCase()) ||
          schedule.CPNT_TYP_DESC.toLowerCase().includes(
            searchQuery.toLowerCase()
          ) ||
          String(schedule.SCHD_ID).includes(searchQuery)
      )
    : [];

  // Skeleton loading items
  const renderSkeletonItems = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <SkeletonScheduleItem key={`skeleton-${index}`}>
          <SkeletonTitle>
            <SkeletonPulse />
          </SkeletonTitle>
          <SkeletonInfo>
            <SkeletonPulse />
          </SkeletonInfo>
          <SkeletonBadge>
            <SkeletonPulse />
          </SkeletonBadge>
          <SkeletonDateRow>
            <SkeletonPulse />
          </SkeletonDateRow>
          <SkeletonDateRow>
            <SkeletonPulse />
          </SkeletonDateRow>
        </SkeletonScheduleItem>
      ));
  };

  return (
    <SidebarContainer>
      <StickyHeader>
        <SidebarTitle>{t("app_title")}</SidebarTitle>
        {!isLoading && (
          <SearchInput
            type="text"
            placeholder={getSFlabel("alt.Search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}
      </StickyHeader>

      <ScrollableContent>
        {isLoading ? (
          renderSkeletonItems()
        ) : filteredSchedules.length > 0 ? (
          filteredSchedules.map((schedule: Sched) => (
            <ScheduleItem
              key={schedule.SCHD_ID}
              onClick={() => onSelect(schedule.SCHD_ID)}
              style={{
                borderLeft:
                  selectedID === schedule.SCHD_ID
                    ? `3px solid ${colors.primarySelected}`
                    : `3px solid ${colors.secondaryLight}`,
                backgroundColor:
                  selectedID === schedule.SCHD_ID
                    ? colors.primarySelectedBg
                    : colors.cardBackground,
              }}
            >
              <Title>{schedule.CPNT_TITLE}</Title>
              <CourseInfo>
                <InfoLabel>{getSFlabel("label.ScheduleID")}:</InfoLabel>{" "}
                {schedule.SCHD_ID}
                <DateInfo>
                  <DateRow>
                    <DateLabel>{getSFlabel("label.From")}:</DateLabel>{" "}
                    {getDateTime(schedule.CLASS_START_DATE)}
                  </DateRow>
                  <DateRow>
                    <DateLabel>{getSFlabel("label.To")}:</DateLabel>{" "}
                    {getDateTime(schedule.CLASS_END_DATE)}
                  </DateRow>
                  <EnrollmentCount>
                    <EnrollmentLabel>
                      {getSFlabel("label.Results")}:
                    </EnrollmentLabel>{" "}
                    {scheduleCounts[schedule.SCHD_ID] || 0}
                  </EnrollmentCount>
                </DateInfo>
              </CourseInfo>
            </ScheduleItem>
          ))
        ) : (
          <NoData>{searchQuery ? t("no_results") : t("loading")}</NoData>
        )}
      </ScrollableContent>
    </SidebarContainer>
  );
};
