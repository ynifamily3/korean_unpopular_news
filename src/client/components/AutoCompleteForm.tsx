/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import NoSsr from "@material-ui/core/NoSsr";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";
import "cross-fetch/polyfill";
import queryString from "query-string";
import ApolloClient, { gql } from "apollo-boost";

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled("div")`
  width: "100%";
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: #40a9ff;
  }

  &.focused {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    font-size: 14px;
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`;

const Tag = styled(({ label, onDelete, ...props }) => (
  <div {...props}>
    <span>{label}</span>
    <CloseIcon onClick={onDelete} />
  </div>
))`
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: #40a9ff;
    background-color: #e6f7ff;
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`;

const Listbox = styled("ul")`
  width: 300px;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: #fff;
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected="true"] {
    background-color: #fafafa;
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li[data-focus="true"] {
    background-color: #e6f7ff;
    cursor: pointer;

    & svg {
      color: #000;
    }
  }
`;

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

export default function CustomizedHook() {
  const [options, setOptions] = useState<KeywordOptions[]>([]);
  const location = useLocation();
  const query = queryString.parse(location.search);
  const includes =
    typeof query.include === "string" && query.include.length > 0
      ? query.include.split("|")
      : [];
  const excludes =
    typeof query.exclude === "string" && query.exclude.length > 0
      ? query.exclude.split("|")
      : [];
  const client = new ApolloClient({
    uri: "https://undertimes.alien.moe/graphql",
  });
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    inputValue,
    setAnchorEl,
  } = useAutocomplete({
    id: "customized-hook-demo",
    defaultValue: [
      ...translateTo(includes, true),
      ...translateTo(excludes, false),
    ], // -> 주소창에 있는거
    multiple: true,
    options: options,
    getOptionLabel: (option) =>
      option.isInclude ? option + "[+]" : option + "[-]",
  });

  useEffect(() => {
    client
      .query({
        query: gql`
          {
            keywords(minWeight: 0.5, limit: 20) {
              value
            }
          }
        `,
      })
      .then((result) => {
        setOptions([
          ...value,
          ...mixInEx(
            translateTo(
              result.data.keywords.map((x) => x.value),
              true
            )
          ),
        ]); // -> 주소창에 있는거 옵션에 추가하는 초기 작업 수행
      });
  }, [location]);

  useEffect(() => {}, [inputValue]);

  useEffect(() => {
    console.log("태그들이 바뀜!", value); // 이거에 따라 히스토리를 푸쉬해주면 될거같다.
  }, [value]);

  return (
    <NoSsr>
      <div style={{ width: "100%" }}>
        <div {...getRootProps()} style={{ color: "black" }}>
          <Label {...getInputLabelProps()}>키워드 검색</Label>
          <InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
            {value.map((option: KeywordOptions, index: number) => (
              <Tag
                label={option.keyword + " " + (option.isInclude ? "✅" : "❌")}
                {...getTagProps({ index })}
              />
            ))}
            <input {...getInputProps()} />
          </InputWrapper>
        </div>
        {groupedOptions.length > 0 ? (
          <Listbox {...getListboxProps()}>
            {groupedOptions.map((option: KeywordOptions, index: number) => (
              <li
                {...getOptionProps({ option, index })}
                style={{ color: "black" }}
              >
                <span>
                  {option.keyword}
                  {option.isInclude ? " ✅" : " ❌"}
                </span>
                <CheckIcon fontSize="small" />
              </li>
            ))}
          </Listbox>
        ) : null}
      </div>
    </NoSsr>
  );
}
