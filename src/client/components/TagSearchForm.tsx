import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
} from "@material-ui/lab/useAutocomplete";
import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

interface KeywordOptions {
  keyword: string;
  isInclude: boolean;
}

function mixInEx(includes: KeywordOptions[]): KeywordOptions[] {
  return includes.flatMap((el) => {
    const el2: KeywordOptions = { keyword: el.keyword, isInclude: false };
    return [el, el2];
  });
}

function translateTo(includes: string[], isInclude: boolean): KeywordOptions[] {
  return includes.map((x) => {
    return { keyword: x, isInclude: isInclude };
  });
}

//
const FETCH_KEYWORDS = gql`
  query Keywords($value: String) {
    keywords(value: $value, minWeight: 0.5, limit: 20) {
      value
    }
  }
`;

export interface TagSearchFormProps {
  includes: string[];
  excludes: string[];
}

export default function TagSearchForm(props: TagSearchFormProps): JSX.Element {
  const { includes, excludes } = props;
  const { loading, error, data, refetch } = useQuery(FETCH_KEYWORDS);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const [options, setOptions] = useState<KeywordOptions[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleChangeInputValue = (
    event: React.ChangeEvent<unknown>,
    value: string,
    reason: AutocompleteInputChangeReason
  ): void => {
    if (reason === "input") {
      setInputValue(value);
      refetch({ value: value });
    }
  };

  const jumpTo = (in_or_ex: number) => (keyword: string): void => {
    const includeParams = [...includes];
    const excludeParams = [...excludes];
    if (in_or_ex === 0) includeParams.push(keyword);
    else excludeParams.push(keyword);
    const includeParam = includeParams.join("|");
    const excludeParam = excludeParams.join("|");
    history.push(
      location.pathname +
        "?include=" +
        includeParam +
        "&exclude=" +
        excludeParam
    );
  };

  const handleChange = (
    event: React.ChangeEvent<unknown>,
    value: KeywordOptions | null,
    reason: AutocompleteChangeReason
  ): void => {
    if (value !== null && reason !== "clear") {
      if (value.isInclude) {
        jumpTo(0)(value.keyword);
      } else {
        jumpTo(1)(value.keyword);
      }
    }
  };

  useEffect(() => {
    console.log("로케이션 변동", location);
    // fetch
  }, [location]);

  useEffect(() => {
    console.log(loading, "로딩변경");
    if (error) {
      console.log(error);
      setOptions([]);
      return;
    }

    if (loading === false && typeof data !== "undefined") {
      // 이미 인클루드나 익스클루드에 있는건 제외 해야 됨.
      const keywords = mixInEx(
        translateTo(
          data.keywords.map((x) => x.value),
          true
        )
      ).filter((x) => {
        if (includes.indexOf(x.keyword) > -1) return false;
        if (excludes.indexOf(x.keyword) > -1) return false;
        // if (options.indexOf(x.keyword) > -1) return false;
        return true;
      });
      setOptions(keywords);
    }
  }, [loading]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionLabel={(option) =>
        option.keyword + (option.isInclude ? " ✅" : " ❌")
      }
      options={options}
      loading={loading}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleChangeInputValue}
      renderInput={(params) => (
        <TextField
          {...params}
          label="키워드 검색"
          // variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
