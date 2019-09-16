/*
 * moleculer-iam
 * Copyright (c) 2019 QMIT Inc. (https://github.com/qmit-pro/moleculer-iam)
 * MIT Licensed
 */

import { ServiceSchema } from "moleculer";

const GreeterService: ServiceSchema = {

  name: "auth",

  /**
   * Default settings
   */
  settings: {},

  /**
   * Actions
   */
  actions: {
    test(ctx) {
      return "Hello " + (ctx.params!.name || "Anonymous");
    },
  },

  /**
   * Methods
   */
  methods: {},

  /**
   * Service created lifecycle event handler
   */
  created() {
  },

  /**
   * Service started lifecycle event handler
   */
  async started() {
  },
  /**
   * Service stopped lifecycle event handler
   */
  async stopped() {
  },
};

export = GreeterService;
