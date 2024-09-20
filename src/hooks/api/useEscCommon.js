import { useNamespace } from "@folio/stripes/core";
import { usePublishCoordinator } from "../usePublishCoordinator";
import { useQuery } from "react-query";

const DEFAULT_DATA = {};

export const useEscCommon = (key, url, tenants, mapResponse, options = {}) => {
    const [namespace] = useNamespace({ key });
    const { initPublicationRequest } = usePublishCoordinator(namespace);

    const { data = DEFAULT_DATA, isFetching } = useQuery({
        queryKey: [namespace, tenants],
        queryFn: async () => {
            const { publicationResults } = await initPublicationRequest({
                url,
                method: 'GET',
                tenants,
            });
            return publicationResults;
        },
        keepPreviousData: true,
        ...options
    });

    const formattedData = () => {
        if (!data?.length || isFetching) return [];
        return data.flatMap(tenantData => {
            const tenantName = tenantData.tenantId;
            return mapResponse(tenantData, tenantName);
        });
    };

    const escData = formattedData().map((item) => ({
        value: item.id,
        label: item.name,
    }));

    return {
        escData,
        isFetching
    };
};
