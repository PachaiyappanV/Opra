export type WorkspaceProps = {
  user: {
    subscription: {
      plan: "FREE" | "PRO";
    } | null;
    workspace: {
      id: string;
      name: string;
      type: "PUBLIC" | "PERSONAL";
    }[];
    members: {
      WorkSpace: {
        id: string;
        name: string;
        type: "PUBLIC" | "PERSONAL";
      };
    }[];
  };
};

export type SearchUserProps = {
  users: {
    id: string;
    subscription: {
      plan: "PRO" | "FREE";
    } | null;
    firstname: string | null;
    lastname: string | null;
    image: string | null;
    email: string | null;
  }[];
};

export type NotificationProps = {
  status: number;
  notifications: {
    _count: {
      notification: number;
    };
  };
};
