import axios from 'axios';
import { XivCollectMountType, XivCollectMinionType } from './types';

export const FFXIV_COLLECT_API_URL = 'https://ffxivcollect.com/api';

type GetCollectableMountsResponse = {
  total: number;
  results: XivCollectMountType[];
};

type GetCollectableMinionsResponse = {
  total: number;
  results: XivCollectMinionType[];
};

export const getCollectableMounts =
  async (): Promise<GetCollectableMountsResponse> => {
    const response = await axios.get(`${FFXIV_COLLECT_API_URL}/mounts`);
    return {
      total: response.data?.total ?? 0,
      results: response.data?.results ?? [],
    };
  };

export const getCollectableMinions =
  async (): Promise<GetCollectableMinionsResponse> => {
    const response = await axios.get(`${FFXIV_COLLECT_API_URL}/minions`);
    return {
      total: response.data?.total ?? 0,
      results: response.data?.results ?? [],
    };
  };
