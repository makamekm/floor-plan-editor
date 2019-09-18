import filterTypes from "./filter.transition";

export default filterTypes.map(v => v.key).filter(k => k !== "all");
