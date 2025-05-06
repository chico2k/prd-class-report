import React, { useMemo } from "react";
import styled from "@emotion/styled";
import { useEmailSelection } from "../hooks/useEmailSelection";
import { Enroll, GroupedUsers } from "../types/indes";
import { colors } from "../config/colors";
import { useTranslation } from "react-i18next";
import { useDataStore } from "../store/dataStore";
import { useLabelStore } from "../store/labelStore";
// Styled components
const Container = styled.div`
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 15px;
  font-size: 14px;
  width: calc(100vw - 400px);
  min-height: 100vh;
  box-sizing: border-box;
  margin-left: 360px;
`;

const Heading = styled.h1`
  font-size: 20px;
  margin-bottom: 15px;
  padding: 0 15px;
  color: ${colors.primary};
`;

const GroupContainer = styled.div`
  margin-bottom: 30px;
  border: 1px solid ${colors.border};
  padding: 15px;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
`;

const GroupHeader = styled.div`
  background-color: ${colors.primaryLight};
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 4px;
`;

const Button = styled.button<{ small?: boolean }>`
  padding: ${(props) => (props.small ? "4px 8px" : "8px 15px")};
  background-color: ${colors.primary};
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: ${(props) => (props.small ? "11px" : "13px")};
  &:hover {
    background-color: ${colors.primaryDark};
  }
`;

const GrayButton = styled(Button)`
  background-color: ${colors.secondary};
  &:hover {
    background-color: ${colors.secondaryDark};
  }
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 8px 0;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 6px;
  border: 1px solid ${colors.borderLight};
  border-radius: 3px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  margin-right: 12px;
  cursor: pointer;
  accent-color: ${colors.primary};
  background-color: ${colors.cardBackground};
  border: 1px solid ${colors.textPrimary};
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border-radius: 2px;
  position: relative;
  &:checked {
    background-color: ${colors.primary};
    border-color: ${colors.primary};
    &::after {
      content: "";
      position: absolute;
      left: 4px;
      top: 1px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: ${colors.secondaryLight};
    border-color: ${colors.textLight};
  }
  &:checked:disabled {
    background-color: ${colors.primary};
    border-color: ${colors.primary};
    &::after {
      border-color: white;
    }
  }
`;

const Label = styled.label`
  cursor: pointer;
  flex: 1;
  line-height: 1.3;
`;

const Name = styled.span<{ disabled?: boolean }>`
  font-weight: 600;
  font-size: 13px;
  color: ${(props) => (props.disabled ? colors.textLight : "inherit")};
`;

const Email = styled.span<{ disabled?: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.disabled ? colors.textLight : "inherit")};
`;

const FixedControls = styled.div`
  position: fixed;
  bottom: 15px;
  right: 15px;
  background-color: ${colors.cardBackground};
  padding: 12px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const EmailButton = styled.a<{ disabled?: boolean }>`
  display: inline-block;
  padding: 8px 15px;
  background-color: ${colors.primary};
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-family: Arial, sans-serif;
  border: none;
  font-size: 13px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
  &:hover {
    background-color: ${colors.primaryDark};
  }
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

const SkeletonGroupContainer = styled.div`
  margin-bottom: 30px;
  border: 1px solid ${colors.borderLight};
  padding: 15px;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
`;

const SkeletonHeader = styled.div`
  height: 20px;
  width: 100%;
  margin-bottom: 15px;
`;

const SkeletonUserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 8px 0;
`;

const SkeletonUserItem = styled.div`
  height: 60px;
  padding: 10px;
  border-radius: 3px;
`;

const SkeletonName = styled.div`
  height: 16px;
  width: 70%;
  margin-bottom: 8px;
`;

const SkeletonEmail = styled.div`
  height: 12px;
  width: 90%;
`;
const EmptyContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const EmptyHeading = styled(Heading)`
  color: ${colors.textLight};
  font-style: italic;
  font-size: 18px;
  font-weight: 400;
`;

export const MainResult: React.FC<{ selectedID: number | null }> = ({
  selectedID,
}) => {
  const { t } = useTranslation();
  const { data, isLoading } = useDataStore();
  const { getSFlabel } = useLabelStore();

  const {
    selectedEmails,
    handleCheckboxChange,
    handleSelectAll,
    handleDeselectAll,
    getMailtoLink,
  } = useEmailSelection();

  // Get selected schedule details
  const selectedSchedule = useMemo(() => {
    if (!data?.sched || !selectedID) return null;
    return data.sched.find((sched) => sched.SCHD_ID === selectedID);
  }, [data, selectedID]);

  // Filter enrollments by selectedID and group by ENRL_STAT_DESC
  const groupedUsers = useMemo(() => {
    if (!data?.enroll || !selectedID) return {};

    // Filter enrollments by the selected schedule ID
    const filteredEnrollments = data.enroll.filter(
      (enrollment) => enrollment.SCHD_ID === selectedID
    );

    // Group filtered enrollments by ENRL_STAT_DESC
    return filteredEnrollments.reduce((acc: GroupedUsers, user: Enroll) => {
      if (!acc[user.ENRL_STAT_DESC]) {
        acc[user.ENRL_STAT_DESC] = [];
      }
      acc[user.ENRL_STAT_DESC].push(user);
      return acc;
    }, {});
  }, [data, selectedID]);

  // Get requests that match the selected schedule's component details
  const matchingRequests = useMemo(() => {
    if (!data?.request || !selectedSchedule) return [];

    // Use the ITEM_KEY field for direct comparison
    // This is more efficient as it avoids multiple string comparisons and date conversion
    return data.request.filter(
      (request) => request.ITEM_KEY === selectedSchedule.ITEM_KEY
    );
  }, [data, selectedSchedule]);

  // Get course title for the selected schedule
  const selectedCourseTitle = useMemo(() => {
    if (!data?.sched || !selectedID) return t("select_option");
    const selectedCourse = data.sched.find(
      (sched) => sched.SCHD_ID === selectedID
    );
    return selectedCourse ? selectedCourse.CPNT_TITLE : t("select_option");
  }, [data, selectedID, t]);

  // Render skeleton loading UI
  const renderSkeletonContent = () => {
    return (
      <>
        <SkeletonHeader>
          <SkeletonPulse />
        </SkeletonHeader>

        {Array(2)
          .fill(0)
          .map((_, groupIndex) => (
            <SkeletonGroupContainer key={`skeleton-group-${groupIndex}`}>
              <SkeletonHeader>
                <SkeletonPulse />
              </SkeletonHeader>

              <SkeletonUserGrid>
                {Array(6)
                  .fill(0)
                  .map((_, userIndex) => (
                    <SkeletonUserItem
                      key={`skeleton-user-${groupIndex}-${userIndex}`}
                    >
                      <SkeletonName>
                        <SkeletonPulse />
                      </SkeletonName>
                      <SkeletonEmail>
                        <SkeletonPulse />
                      </SkeletonEmail>
                    </SkeletonUserItem>
                  ))}
              </SkeletonUserGrid>
            </SkeletonGroupContainer>
          ))}
      </>
    );
  };

  // Show loading skeleton when data is being fetched
  if (isLoading) {
    return <Container>{renderSkeletonContent()}</Container>;
  }

  // If no schedule is selected yet
  if (Object.keys(groupedUsers).length === 0 && matchingRequests.length === 0) {
    return (
      <EmptyContainer>
        <EmptyHeading>{t("no_results")}</EmptyHeading>
      </EmptyContainer>
    );
  }

  return (
    <Container>
      <Heading>{selectedCourseTitle}</Heading>

      <div id="groups-container">
        {/* Display enrolled users grouped by enrollment status */}
        {Object.entries(groupedUsers).map(([status, users]) => (
          <GroupContainer key={status}>
            <GroupHeader>
              <span>
                {status} ({users.length} {getSFlabel("label.Results")})
              </span>
              <ButtonContainer>
                <GrayButton onClick={handleDeselectAll} small>
                  {getSFlabel("label.Cancel")}
                </GrayButton>
                <Button onClick={() => handleSelectAll(users)} small>
                  {getSFlabel("label.Select")}
                </Button>
              </ButtonContainer>
            </GroupHeader>

            <UserGrid>
              {users.map((user, index) => (
                <UserItem key={`enroll-${index}`}>
                  <Checkbox
                    type="checkbox"
                    value={user.EMAIL_ADDR || ""}
                    checked={selectedEmails.includes(user.EMAIL_ADDR || "")}
                    onChange={(e) =>
                      handleCheckboxChange(user.EMAIL_ADDR, e.target.checked)
                    }
                    disabled={!user.EMAIL_ADDR}
                  />
                  <Label>
                    <Name disabled={!user.EMAIL_ADDR}>
                      {user.FNAME} {user.LNAME}
                    </Name>
                    <br />
                    <Email disabled={!user.EMAIL_ADDR}>
                      {user.EMAIL_ADDR || t("not_available")}
                    </Email>
                  </Label>
                </UserItem>
              ))}
            </UserGrid>
          </GroupContainer>
        ))}

        {/* Display requests that match the selected schedule's component */}
        {matchingRequests.length > 0 && (
          <GroupContainer>
            <GroupHeader>
              <span>
                {getSFlabel("label.Requests")}: ({matchingRequests.length}{" "}
                {getSFlabel("label.Results")})
              </span>
              <ButtonContainer>
                <GrayButton onClick={handleDeselectAll} small>
                  {getSFlabel("label.Cancel")}
                </GrayButton>
                <Button
                  onClick={() =>
                    handleSelectAll(
                      matchingRequests
                        .filter((req) => !!req.EMAIL_ADDR)
                        .map(
                          (req) =>
                            ({
                              EMAIL_ADDR: req.EMAIL_ADDR,
                              FNAME: req.FNAME,
                              LNAME: req.LNAME,
                            } as Enroll)
                        )
                    )
                  }
                  small
                >
                  {t("select_option")}
                </Button>
              </ButtonContainer>
            </GroupHeader>

            <UserGrid>
              {matchingRequests.map((request, index) => (
                <UserItem key={`request-${index}`}>
                  <Checkbox
                    type="checkbox"
                    value={request.EMAIL_ADDR || ""}
                    checked={selectedEmails.includes(request.EMAIL_ADDR || "")}
                    onChange={(e) =>
                      handleCheckboxChange(request.EMAIL_ADDR, e.target.checked)
                    }
                    disabled={!request.EMAIL_ADDR}
                  />
                  <Label>
                    <Name disabled={!request.EMAIL_ADDR}>
                      {request.FNAME} {request.LNAME}
                    </Name>
                    <br />
                    <Email disabled={!request.EMAIL_ADDR}>
                      {request.EMAIL_ADDR || t("no_results")}
                    </Email>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#888",
                        display: "block",
                        marginTop: "3px",
                      }}
                    ></span>
                  </Label>
                </UserItem>
              ))}
            </UserGrid>
          </GroupContainer>
        )}
      </div>

      <FixedControls>
        <span style={{ marginRight: "12px", fontSize: "13px" }}>
          {selectedEmails.length} {t("results")}
        </span>
        <GrayButton onClick={handleDeselectAll} style={{ marginRight: "8px" }}>
          {getSFlabel("label.Cancel")}
        </GrayButton>
        <EmailButton
          href={getMailtoLink(selectedCourseTitle)}
          disabled={selectedEmails.length === 0}
        >
          {getSFlabel("alt.SendEmail")}
        </EmailButton>
      </FixedControls>
    </Container>
  );
};
