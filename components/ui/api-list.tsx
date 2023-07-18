"use client";

import UseOrigin from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import ApiAlert from "./api-alert";

interface ApiListProps {
  entityName: string;
  entityIdName: string;
}

const ApiList: React.FC<ApiListProps> = ({ entityName, entityIdName }) => {
  const params = useParams();
  const origin = UseOrigin();
  const baseURL = `${origin}/api/${params.storeId}`;
  return (
    <>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseURL}/${entityName}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseURL}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="POST"
        variant="admin"
        description={`${baseURL}/${entityName}`}
      />
      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseURL}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseURL}/${entityName}/{${entityIdName}}`}
      />
    </>
  );
};

export default ApiList;
