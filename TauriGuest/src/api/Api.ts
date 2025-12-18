/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ApiPingResp {
  status?: string;
}

export interface DsHeaterProduct {
  createdAt?: string;
  deletedAt?: string;
  description?: string;
  efficiency?: string;
  id?: number;
  image?: string;
  isDelete?: boolean;
  power?: string;
  title?: string;
  type?: string;
  updatedAt?: string;
}

export interface DsHeatersProductRequest {
  carrierVolume?: number;
  /** новое поле */
  cost?: number;
  createdAt?: string;
  creatorID?: number;
  deletedAt?: string;
  id?: number;
  insideTemperature?: number;
  outsideTemperature?: number;
  placeSquare?: number;
  requestHeaters?: DsRequestHeater[];
  status?: string;
  updatedAt?: string;
  /** владелец заявки */
  userID?: number;
}

export interface DsRequestHeater {
  /** @format float64 */
  area?: number;
  /** @format float64 */
  cost?: number;
  deletedAt?: string;
  heaterProduct?: DsHeaterProduct;
  heatersProductID?: number;
  heatersProductRequestID?: number;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title No title
 * @contact
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Get list of heaters with cart count
   *
   * @tags catalog
   * @name GetRoot
   * @summary Get catalog of heaters
   * @request GET:/
   */
  getRoot = (params: RequestParams = {}) =>
    this.request<Record<string, any>, Record<string, any>>({
      path: `/`,
      method: "GET",
      format: "json",
      ...params,
    });

  addToCart = {
    /**
     * No description
     *
     * @name AddToCartCreate
     * @summary Add heater to cart
   * @request POST:/add-to-cart/{id}
     */
    addToCartCreate: (id: number, params: RequestParams = {}) =>
      this.request<any, string | Record<string, any>>({
        path: `/add-to-cart/${id}`,
        method: "POST",
        ...params,
      }),
  };
  clearCart = {
    /**
     * No description
     *
     * @name ClearCartCreate
     * @summary Clear cart
   * @request POST:/clear-cart
     */
    clearCartCreate: (params: RequestParams = {}) =>
      this.request<any, string | Record<string, any>>({
        path: `/clear-cart`,
        method: "POST",
        ...params,
      }),
  };
  heater = {
    /**
     * No description
     *
     * @name HeaterCreate
     * @summary Add new heater product
   * @request POST:/heater
     */
    heaterCreate: (product: DsHeaterProduct, params: RequestParams = {}) =>
      this.request<DsHeaterProduct, Record<string, any>>({
        path: `/heater`,
        method: "POST",
        body: product,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name HeaterDetail
     * @summary Get heater by ID
   * @request GET:/heater/{id}
     */
    heaterDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsHeaterProduct, Record<string, any>>({
        path: `/heater/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name HeaterUpdate
     * @summary Update heater product
   * @request PUT:/heater/{id}
     */
    heaterUpdate: (
      id: number,
      product: DsHeaterProduct,
      params: RequestParams = {},
    ) =>
      this.request<DsHeaterProduct, Record<string, any>>({
        path: `/heater/${id}`,
        method: "PUT",
        body: product,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name HeaterDelete
     * @summary Delete heater product (soft)
   * @request DELETE:/heater/{id}
     */
    heaterDelete: (id: number, params: RequestParams = {}) =>
      this.request<string, Record<string, any>>({
        path: `/heater/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name ImageCreate
     * @summary Upload image for heater product
   * @request POST:/heater/{id}/image
     */
    imageCreate: (
      id: number,
      data: {
        /** Image file */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, Record<string, any>>({
        path: `/heater/${id}/image`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  heatersApplication = {
    /**
     * No description
     *
     * @name ModerateUpdate
     * @summary Moderate heater request (change status)
     * @request PUT:/heaters_application/moderate/{id}
     */
    moderateUpdate: (
      id: number,
      query: {
        /** New status: завершено или отклонено */
        status: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, Record<string, any>>({
        path: `/heaters_application/moderate/${id}`,
        method: "PUT",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name ProductUpdate
     * @summary Update heater in request (area, cost will be recalculated)
     * @request PUT:/heaters_application/product
     */
    productUpdate: (
      request: {
        " area"?: number;
        " product_id"?: number;
        request_id?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, Record<string, any>>({
        path: `/heaters_application/product`,
        method: "PUT",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name SubmitUpdate
     * @summary Submit heater request
     * @request PUT:/heaters_application/submit/{id}
     */
    submitUpdate: (id: number, params: RequestParams = {}) =>
      this.request<string, Record<string, any>>({
        path: `/heaters_application/submit/${id}`,
        method: "PUT",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name HeatersApplicationUpdate
     * @summary Update heater request
     * @request PUT:/heaters_application/{id}
     */
    heatersApplicationUpdate: (
      id: number,
      request: DsHeatersProductRequest,
      params: RequestParams = {},
    ) =>
      this.request<DsHeatersProductRequest, Record<string, any>>({
        path: `/heaters_application/${id}`,
        method: "PUT",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  login = {
    /**
     * @description Авторизация по логину и паролю, возвращает JWT или session
     *
     * @tags Users
     * @name LoginCreate
     * @summary Вход пользователя
   * @request POST:/login
     */
    loginCreate: (
      login: {
        login?: string;
        password?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/login`,
        method: "POST",
        body: login,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  logout = {
    /**
     * @description Добавляет токен пользователя в blacklist
     *
     * @tags Users
     * @name LogoutCreate
     * @summary Logout user
   * @request POST:/logout
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/logout`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  ping = {
    /**
     * @description very very friendly response
     *
     * @tags Tests
     * @name PingDetail
     * @summary Show hello text
   * @request GET:/ping/{name}
     */
    pingDetail: (name: string, params: RequestParams = {}) =>
      this.request<ApiPingResp, any>({
        path: `/ping/${name}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  register = {
    /**
     * No description
     *
     * @name RegisterCreate
     * @summary Register new user
   * @request POST:/register
     */
    registerCreate: (
      user: {
        login?: string;
        password?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, Record<string, any>>({
        path: `/register`,
        method: "POST",
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
