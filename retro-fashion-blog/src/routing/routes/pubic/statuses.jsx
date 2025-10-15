import _401NotAuthorized from "@pages/statuses/http/_401NotAuthorized";
import _500ServerError from "@pages/statuses/http/_500ServerError";
import Maintenance from "@pages/statuses/http/Maintenance";
import ComingSoon from "@pages/statuses/http/ComingSoon";
import _403Forbidden from "@pages/statuses/http/_403Forbidden";
import PATHS from "@/constants/paths";

const httpStatusesRoutes = [
    { path: PATHS.STATUSES_NOT_AUTHORIZED, element: <_401NotAuthorized />, exact: true },
    { path: PATHS.STATUSES_SERVER_ERROR, element: <_500ServerError />, exact: true },
    { path: PATHS.STATUSES_MAINTENANCE, element: <Maintenance />, exact: true },
    { path: PATHS.STATUSES_COMING_SOON, element: <ComingSoon />, exact: true },
    { path: PATHS.STATUSES_FORBIDDEN, element: <_403Forbidden />, exact: true },
]


export default [
    ...httpStatusesRoutes,
];