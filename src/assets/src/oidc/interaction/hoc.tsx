import React from "react";

export type withLoadingProps = { loading: boolean, errors: {[key: string]: string}, withLoading: (callback: () => void | Promise<void>) => void };

export function withLoading<P extends withLoadingProps = withLoadingProps>(WrappedComponent: React.ComponentType<P>) {
  return class extends React.Component<P, Omit<withLoadingProps, "withLoading">> {
    public static contextType: any;
    public static displayName = `withAfterLoading(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

    public render() {
      return <WrappedComponent {...this.props} {...this.state} withLoading={this.withLoading}/>;
    }

    public withLoading = (callback: () => void | Promise<void>): void => {
      if (this.state.loading) return;
      this.setState({loading: true, errors: {}}, async () => {
        try {
          await callback();
        } catch (error) {
          console.error(error);
          this.setState({errors: {global: error.toString()}});
        } finally {
          this.setState({loading: false});
        }
      });
    }
  };
}
