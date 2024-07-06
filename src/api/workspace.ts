import { workspace } from '@/constants/queryKey';
import { IWorkspaceInputs } from '@/types/\bworkSpace';
import customAxios from '@/utils/cutstomAxios';

type SearchProps = {
  type?: string;
  keyword?: string;
  page: any;
};

type JoinWorkspace = {
  password: string;
  task: string;
  workspaceId: number;
};

interface IMissions {
  id: number;
  count: number;
}

type Mission = {
  workspaceId: number;
  missions: IMissions[];
};
type MissionRecord = {
  workspaceId: number;
  userId: number;
};

type PasswordCheck = {
  workspaceId: number;
  password: string;
};

const myWorkspaces = async (page: number = 0) => {
  const res = await customAxios.get(`/workspaces/my?page=${page}`);
  return res;
};

const allWorkspaces = async ({ type, keyword = '', page = 0 }: SearchProps) => {
  const res = await customAxios.get(
    `/workspaces?status=${type}&keyword=${keyword}&page=${page}`,
  );

  return res;
};

const createWorkspace = async (data: any) => {
  const res = await customAxios.post('/workspaces', data);
  return res;
};

const matchPassword = async ({ workspaceId, password }: PasswordCheck) => {
  const res = await customAxios.post(
    `/workspaces/${workspaceId}/match-password`,
    { password },
  );

  return res;
};

const joinWorkspace = async ({
  password,
  task,
  workspaceId,
}: JoinWorkspace) => {
  const formData = { password, task };
  const res = await customAxios.post(
    `/workspaces/${workspaceId}/join`,
    formData,
  );
  return res;
};
const leaveWorkspace = async (workspaceId: number) => {
  const res = await customAxios.post(`/workspaces/${workspaceId}/leave`);
  return res;
};

const startWorkspace = async (workspaceId: number) => {
  const res = await customAxios.patch(`/workspaces/${workspaceId}/start`);
  return res;
};

const infoWorkspace = async (workspaceId: number) => {
  const res = await customAxios.get(`/workspaces/${workspaceId}`);
  return res;
};

const missionsWorkspace = async (workspaceId: number) => {
  const res = await customAxios.get(`/workspaces/${workspaceId}/missions`);
  return res;
};

const missionsRecord = async ({ workspaceId, userId }: MissionRecord) => {
  const res = await customAxios.get(
    `/workspaces/${workspaceId}/workings/${userId}`,
  );
  return res;
};

const postMissions = async ({ workspaceId, missions }: any) => {
  const id = Number(workspaceId);
  console.log(missions);
  const res = await customAxios.post(`/workspaces/${id}/missions`, missions);
  return res;
};

const userMissions = async ({ workspaceId, userId }: MissionRecord) => {
  const res = await customAxios.get(
    `/workspaces/${workspaceId}/workings/${userId}`,
  );
  return res;
};

export {
  myWorkspaces,
  allWorkspaces,
  createWorkspace,
  joinWorkspace,
  startWorkspace,
  leaveWorkspace,
  infoWorkspace,
  matchPassword,
  missionsWorkspace,
  postMissions,
  missionsRecord,
  userMissions,
};