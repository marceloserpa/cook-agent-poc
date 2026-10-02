FROM cook-sandbox
# Add project-specific dependencies below.

# Pre-fetch Yarn 4 (the sandbox network is restricted, so corepack can't download it at runtime)
ENV COREPACK_HOME=/usr/local/share/corepack
RUN corepack enable && corepack prepare yarn@4.18.0 --activate && chmod -R a+rwX /usr/local/share/corepack
